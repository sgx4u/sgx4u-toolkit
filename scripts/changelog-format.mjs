import { spawnSync } from "node:child_process";

/**
 * Changesets calls `getReleaseLine` once per changeset and wraps the result
 * in `### Major Changes`, `### Minor Changes`, or `### Patch Changes`.
 * One call cannot see the other changesets in the version. `getReleaseLine`
 * therefore writes tagged blocks, and `rewriteChangelog` groups them.
 * `scripts/version-packages.mjs` runs that rewrite after `changeset version`.
 *
 * Links stay offline. A `Pull request:` line wins. Otherwise the commit
 * subject is read locally, and a trailing `(#123)` becomes the pull request
 * link. Otherwise the bullet links to the commit. `@changesets/get-github-info`
 * would ask the GitHub API during versioning and needs a token.
 */

// Changelog section order. A category with no entries is omitted.
const categoryOrder = [
    "Breaking",
    "Added",
    "Changed",
    "Deprecated",
    "Removed",
    "Fixed",
    "Security",
];

const categoryHeadings = {
    Breaking: "⚠️ Breaking changes",
    Added: "Added",
    Changed: "Changed",
    Deprecated: "Deprecated",
    Removed: "Removed",
    Fixed: "Fixed",
    Security: "Security",
};

const categoryTagPattern =
    /^(Summary|Pull request|Breaking|Added|Changed|Deprecated|Removed|Fixed|Security):\s*(.*)$/;

const defaultRepository = "sgx4u/sgx4u-toolkit";

/**
 * Reads one changeset body into a summary, a pull request number, and entries.
 *
 * Use this before writing a changelog line, or from a check that needs to
 * reject a malformed note. The body is one `Summary:` line, an optional
 * `Pull request:` line, and at least one category line. A category line
 * starts with the affected export or option in backticks. Later lines belong
 * to the tag above them, which is how a breaking change keeps its migration
 * fence.
 *
 * @param {string} summary Changeset markdown after the frontmatter.
 * @param {{ name: string, type: string }[]} [releases] Bumps from the frontmatter. Used to reject `Breaking` on a patch. Defaults to an empty list, which skips that check.
 * @returns {{ summary: string | null, pullRequestNumber: string | null, entries: { category: string, body: string }[] }}
 * @throws {Error} When the body is empty, a line has no tag, a tag is repeated, `Summary` or `Pull request` is empty or invalid, a category line omits the backticked name, there is no category line, or `Breaking` is paired with a patch bump.
 * @example
 * parseChangesetNotes("Summary: First release.\n\nAdded: `formatLabel` returns the label.")
 */
export function parseChangesetNotes(summary, releases = []) {
    const trimmed = summary.replace(/^\n+|\n+$/g, "");
    if (trimmed.length === 0) {
        throw new Error(
            "Changeset summary is empty. Add a Summary line and at least one category entry.",
        );
    }

    /** @type {{ tag: string, lines: string[] }[]} */
    const records = [];
    /** @type {{ tag: string, lines: string[] } | null} */
    let current = null;
    for (const line of trimmed.split("\n")) {
        const tagMatch = categoryTagPattern.exec(line);
        if (tagMatch) {
            if (current) {
                records.push(current);
            }
            current = { tag: tagMatch[1], lines: [tagMatch[2]] };
            continue;
        }
        if (!current) {
            throw new Error(
                `Changeset notes must start with Summary, Pull request, or a category tag. Unexpected line: ${line}`,
            );
        }
        current.lines.push(line);
    }
    if (current) {
        records.push(current);
    }

    /** @type {string | null} */
    let summaryText = null;
    /** @type {string | null} */
    let pullRequestNumber = null;
    /** @type {{ category: string, body: string }[]} */
    const entries = [];

    for (const record of records) {
        const text = trimEntryLines(record.lines);
        if (record.tag === "Summary") {
            if (summaryText) {
                throw new Error("A changeset has more than one Summary line.");
            }
            const flattened = text.replace(/\n+/g, " ").trim();
            if (!flattened) {
                throw new Error("Summary is empty.");
            }
            if (flattened.includes("-->")) {
                throw new Error("Summary cannot contain `-->`.");
            }
            summaryText = flattened;
            continue;
        }
        if (record.tag === "Pull request") {
            if (pullRequestNumber) {
                throw new Error(
                    "A changeset has more than one Pull request line.",
                );
            }
            const numberText = text.trim();
            if (!/^\d+$/.test(numberText)) {
                throw new Error(
                    `Pull request must be a number. Received ${JSON.stringify(numberText)}.`,
                );
            }
            pullRequestNumber = numberText;
            continue;
        }
        const firstLine = text.split("\n")[0] ?? "";
        if (!/^`[^`\n]+`/.test(firstLine)) {
            throw new Error(
                `${record.tag} entry must start with the affected export or option in backticks. Received: ${firstLine}`,
            );
        }
        entries.push({ category: record.tag, body: text });
    }

    if (entries.length === 0) {
        throw new Error(
            "Changeset has no category entries. Add Added, Changed, Deprecated, Removed, Fixed, Security, or Breaking.",
        );
    }
    if (
        entries.some((entry) => entry.category === "Breaking") &&
        releases.some((release) => release.type === "patch")
    ) {
        throw new Error(
            "A Breaking entry cannot use a patch bump. Use minor while the package is 0.x, and major from 1.0.0.",
        );
    }

    return { summary: summaryText, pullRequestNumber, entries };
}

/**
 * @param {string[]} lines
 */
function trimEntryLines(lines) {
    let start = 0;
    let end = lines.length;
    while (start < end && lines[start].trim() === "") {
        start += 1;
    }
    while (end > start && lines[end - 1].trim() === "") {
        end -= 1;
    }
    return lines.slice(start, end).join("\n");
}

/**
 * Reads a changeset file into its frontmatter releases and its notes.
 *
 * Use this from the changeset check. The frontmatter is the `---` block
 * Changesets writes, one `"package": major|minor|patch` line per release.
 *
 * @param {string} markdown Full file contents.
 * @param {string} filePath Path included in error messages. It is not read from disk.
 * @returns {{ releases: { name: string, type: string }[], notes: { summary: string | null, pullRequestNumber: string | null, entries: { category: string, body: string }[] } }}
 * @throws {Error} When the frontmatter block is missing, a line is not a release, no package is listed, or {@link parseChangesetNotes} rejects the body. The message starts with `filePath`.
 * @example
 * parseChangesetFile("---\n\"@sgx4u/example\": minor\n---\n\nSummary: First release.\n\nAdded: `formatLabel` returns the label.\n", ".changeset/example.md")
 */
export function parseChangesetFile(markdown, filePath) {
    const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(markdown);
    if (!match) {
        throw new Error(
            `${filePath} is missing a Changesets frontmatter block.`,
        );
    }

    /** @type {{ name: string, type: string }[]} */
    const releases = [];
    for (const line of match[1].split(/\r?\n/)) {
        if (line.trim() === "") {
            continue;
        }
        const releaseMatch = /^"([^"]+)":\s*(major|minor|patch)\s*$/.exec(line);
        if (!releaseMatch) {
            throw new Error(
                `${filePath} has an unsupported frontmatter line: ${line}`,
            );
        }
        releases.push({ name: releaseMatch[1], type: releaseMatch[2] });
    }
    if (releases.length === 0) {
        throw new Error(`${filePath} does not list a package.`);
    }

    let notes;
    try {
        notes = parseChangesetNotes(match[2], releases);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`${filePath}: ${message}`, { cause: error });
    }
    return { releases, notes };
}

/**
 * Returns the pull request number at the end of a commit subject.
 *
 * Use this when a changeset has no `Pull request:` line. GitHub adds
 * `(#123)` to the squash subject, and that number becomes the changelog link.
 * Any other subject shape returns null so the changelog can link the commit
 * instead.
 *
 * @param {string | null | undefined} subject First line of the commit message.
 * @returns {string | null} Digits from a trailing `(#123)`, or null.
 * @example
 * pullRequestNumberFromCommitSubject("fix: keep blank labels (#42)")
 */
export function pullRequestNumberFromCommitSubject(subject) {
    if (!subject) {
        return null;
    }
    const match = /\(#(\d+)\)\s*$/.exec(subject);
    return match ? match[1] : null;
}

/**
 * Markdown link suffix for one changelog bullet.
 *
 * A pull request number wins. Otherwise a full commit hash becomes a
 * seven-character link. Otherwise the bullet has no link, which keeps
 * versioning from failing when the commit is unknown.
 *
 * @param {string | null} pullRequestNumber
 * @param {string | null | undefined} commitHash
 * @param {string} repository `owner/name` used in the GitHub URL.
 * @returns {string}
 */
function changeLink(pullRequestNumber, commitHash, repository) {
    if (pullRequestNumber) {
        return ` ([#${pullRequestNumber}](https://github.com/${repository}/pull/${pullRequestNumber}))`;
    }
    if (commitHash && /^[0-9a-f]{7,40}$/i.test(commitHash)) {
        const shortCommitHash = commitHash.slice(0, 7);
        return ` ([${shortCommitHash}](https://github.com/${repository}/commit/${commitHash}))`;
    }
    return "";
}

/**
 * Commit subject for `commitHash`, or null when it cannot be read.
 *
 * `options.commitSubjects` supplies the subject during tests and any run
 * that must stay offline. A hash missing from that map is read with
 * `git log`. A failed git read returns null so the bullet can still be written.
 *
 * @param {string | undefined} commitHash
 * @param {Record<string, unknown> | null | undefined} options
 * @returns {string | null}
 */
function commitSubject(commitHash, options) {
    if (
        typeof commitHash !== "string" ||
        !/^[0-9a-f]{7,40}$/i.test(commitHash)
    ) {
        return null;
    }
    const knownSubjects = options?.commitSubjects;
    if (
        knownSubjects &&
        typeof knownSubjects === "object" &&
        Object.hasOwn(knownSubjects, commitHash)
    ) {
        const subject = knownSubjects[commitHash];
        return typeof subject === "string" ? subject : null;
    }
    const workingDirectory =
        typeof options?.workingDirectory === "string"
            ? options.workingDirectory
            : process.cwd();
    const result = spawnSync("git", ["log", "-1", "--format=%s", commitHash], {
        cwd: workingDirectory,
        encoding: "utf8",
    });
    if (result.status !== 0) {
        return null;
    }
    const subject = result.stdout.trim();
    return subject.length > 0 ? subject : null;
}

/**
 * `owner/name` for changelog links.
 *
 * A repository option without `/` is ignored so a bare name cannot build a
 * broken GitHub URL. The fallback is this repository.
 *
 * @param {Record<string, unknown> | null | undefined} options
 * @returns {string}
 */
function repositoryName(options) {
    if (
        typeof options?.repository === "string" &&
        options.repository.includes("/")
    ) {
        return options.repository;
    }
    return defaultRepository;
}

/**
 * `YYYY-MM-DD` stamped on the version heading.
 *
 * A date option in any other shape is ignored and the value is today in UTC,
 * so the heading stays one date token.
 *
 * @param {Record<string, unknown> | null | undefined} options
 * @returns {string}
 */
function releaseDate(options) {
    if (
        typeof options?.date === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(options.date)
    ) {
        return options.date;
    }
    return new Date().toISOString().slice(0, 10);
}

/**
 * @param {string} category
 * @param {string} body
 */
function entryBlock(category, body) {
    return `<!-- changelog-entry: ${category} -->\n${body}\n<!-- /changelog-entry -->`;
}

/**
 * @param {string} body
 * @param {string} link
 */
function entryBodyWithLink(body, link) {
    if (!link) {
        return body;
    }
    const lines = body.split("\n");
    lines[0] = `${lines[0]}${link}`;
    return lines.join("\n");
}

/**
 * Builds the tagged blocks Changesets stores for one changeset.
 *
 * Changesets calls this once per file and wraps the result in a bump
 * heading. The tags let {@link rewriteChangelog} group every note in the
 * version. `.changeset/config.json` points the changelog at this module.
 * `releaseType` is unused because the notes carry their own categories.
 *
 * Link choice: a `Pull request:` line wins. Otherwise the commit subject is
 * read and a trailing `(#123)` becomes the link. Otherwise the bullet links
 * to the commit.
 *
 * @param {{ id?: string, summary: string, releases?: { name: string, type: string }[], commit?: string }} changeset Changeset Changesets passes. `summary` is the markdown body. `commit` is the hash that added the file, when Changesets knows it.
 * @param {string} _releaseType Bump Changesets computed (`major`, `minor`, or `patch`).
 * @param {Record<string, unknown> | null} [options] `repository` is `owner/name` and defaults to `sgx4u/sgx4u-toolkit`. `date` is `YYYY-MM-DD` and defaults to today in UTC. `commitSubjects` maps a hash to its subject. `workingDirectory` is the git directory for a subject lookup and defaults to the current directory.
 * @returns {string} A date tag, an optional summary tag, and one entry tag per category.
 * @throws {Error} When {@link parseChangesetNotes} rejects the summary. The message starts with the changeset id, or `(unknown)` when `id` is missing.
 * @example
 * getReleaseLine(
 *   { summary: "Summary: First release.\n\nAdded: `formatLabel` returns the label.", releases: [] },
 *   "minor",
 *   { date: "2026-11-25", repository: "sgx4u/sgx4u-toolkit" },
 * )
 */
export function getReleaseLine(changeset, _releaseType, options) {
    let notes;
    try {
        notes = parseChangesetNotes(
            changeset.summary,
            changeset.releases ?? [],
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(
            `Changeset ${changeset.id ?? "(unknown)"}: ${message}`,
            {
                cause: error,
            },
        );
    }

    const repository = repositoryName(options);
    const subject = notes.pullRequestNumber
        ? null
        : commitSubject(changeset.commit, options);
    const pullRequestNumber =
        notes.pullRequestNumber ?? pullRequestNumberFromCommitSubject(subject);
    const link = changeLink(pullRequestNumber, changeset.commit, repository);
    /** @type {string[]} */
    const blocks = [`<!-- changelog-date: ${releaseDate(options)} -->`];
    if (notes.summary) {
        blocks.push(
            `<!-- changelog-summary -->\n${notes.summary}\n<!-- /changelog-summary -->`,
        );
    }
    for (const entry of notes.entries) {
        blocks.push(
            entryBlock(entry.category, entryBodyWithLink(entry.body, link)),
        );
    }
    return blocks.join("\n");
}

/**
 * Builds `Changed` blocks for workspace dependents Changesets bumped.
 *
 * Changesets calls this after {@link getReleaseLine}. Packages are sorted by
 * name so the changelog order stays stable. A dependent with no
 * `newVersion` is skipped because there is no version to report. An empty
 * list returns an empty string, which tells Changesets to omit the line.
 *
 * @param {unknown[]} _dependencyChangesets Changesets that caused the bump. The text comes from `dependentReleases`, so this argument is unused.
 * @param {{ name: string, newVersion?: string }[]} dependentReleases Packages whose version changed because a workspace dependency changed.
 * @param {Record<string, unknown> | null} [_options] Changelog options. This line has no link or date, so the options are unused.
 * @returns {string} Tagged `Changed` blocks, or `""` when nothing changed.
 * @example
 * getDependencyReleaseLine([], [{ name: "@sgx4u/example", newVersion: "0.2.0" }])
 */
export function getDependencyReleaseLine(
    _dependencyChangesets,
    dependentReleases,
    _options,
) {
    if (!dependentReleases || dependentReleases.length === 0) {
        return "";
    }
    const ordered = [...dependentReleases].sort((left, right) =>
        left.name.localeCompare(right.name),
    );
    /** @type {string[]} */
    const blocks = [];
    for (const dependentRelease of ordered) {
        if (!dependentRelease.newVersion) {
            continue;
        }
        blocks.push(
            entryBlock(
                "Changed",
                `\`${dependentRelease.name}\` is updated to \`${dependentRelease.newVersion}\`.`,
            ),
        );
    }
    return blocks.join("\n");
}

/**
 * @param {string} body
 */
function renderBullet(body) {
    const lines = body.split("\n");
    const firstLine = `- ${lines[0]}`;
    if (lines.length === 1) {
        return firstLine;
    }
    const continuation = lines
        .slice(1)
        .map((line) => (line.length === 0 ? "" : `    ${line}`))
        .join("\n");
    return `${firstLine}\n${continuation}`;
}

/**
 * @param {string} section
 * @param {boolean} hasFollowingSection
 */
function rewriteSection(section, hasFollowingSection) {
    if (
        !section.includes("<!-- changelog-entry:") &&
        !section.includes("<!-- changelog-date:")
    ) {
        return section;
    }

    const headingMatch = /^##\s+(.+?)\s*$/m.exec(section);
    if (!headingMatch) {
        return section;
    }
    const versionText = headingMatch[1];
    const dateMatch = /<!-- changelog-date:\s*(\d{4}-\d{2}-\d{2})\s*-->/.exec(
        section,
    );
    const summaries = [
        ...section.matchAll(
            /<!-- changelog-summary -->\n([\s\S]*?)\n<!-- \/changelog-summary -->/g,
        ),
    ]
        .map((match) => match[1].trim())
        .filter((summaryText) => summaryText.length > 0);
    const uniqueSummaries = [...new Set(summaries)];
    const entries = [
        ...section.matchAll(
            /<!-- changelog-entry:\s*([A-Za-z]+)\s*-->\n([\s\S]*?)\n<!-- \/changelog-entry -->/g,
        ),
    ].map((match) => ({ category: match[1], body: match[2].trim() }));

    if (entries.length === 0) {
        throw new Error(
            `Changelog section ${versionText} has release markers but no entries.`,
        );
    }
    for (const entry of entries) {
        if (!Object.hasOwn(categoryHeadings, entry.category)) {
            throw new Error(
                `Unknown changelog category "${entry.category}" in ${versionText}.`,
            );
        }
    }

    const heading = dateMatch
        ? `## ${versionText} — ${dateMatch[1]}`
        : `## ${versionText}`;
    /** @type {string[]} */
    const lines = [heading, ""];
    if (uniqueSummaries.length > 0) {
        lines.push(uniqueSummaries.join(" "), "");
    }
    for (const category of categoryOrder) {
        const categoryEntries = entries.filter(
            (entry) => entry.category === category,
        );
        if (categoryEntries.length === 0) {
            continue;
        }
        const rendered = categoryEntries.map((entry) =>
            renderBullet(entry.body),
        );
        const anyMultiline = rendered.some((bullet) => bullet.includes("\n"));
        lines.push(
            `### ${categoryHeadings[category]}`,
            "",
            rendered.join(anyMultiline ? "\n\n" : "\n"),
            "",
        );
    }

    const body = lines.join("\n").replace(/\n+$/, "");
    return hasFollowingSection ? `${body}\n\n` : `${body}\n`;
}

/**
 * Replaces Changesets bump headings with category sections.
 *
 * `scripts/version-packages.mjs` calls this after `changeset version`. Each
 * `##` section that contains changelog tags becomes a dated heading, one
 * summary paragraph, and the categories that have entries, in
 * Breaking, Added, Changed, Deprecated, Removed, Fixed, Security order.
 * A section with no tags is copied through, so an already rewritten
 * changelog stays as it is. A file with no `##` heading is returned unchanged.
 *
 * @param {string} markdown Library `CHANGELOG.md` contents, including the tagged blocks from {@link getReleaseLine}.
 * @returns {string} Markdown with those sections rewritten.
 * @throws {Error} When a tagged section has no entries, or a tag name is not one of the categories above.
 * @example
 * rewriteChangelog("## 0.1.0\n\n<!-- changelog-date: 2026-11-25 -->\n<!-- changelog-entry: Added -->\n`formatLabel` returns the label.\n<!-- /changelog-entry -->\n")
 */
export function rewriteChangelog(markdown) {
    const matches = [...markdown.matchAll(/^## .+$/gm)];
    if (matches.length === 0) {
        return markdown;
    }

    let rewritten = "";
    let cursor = 0;
    for (const [index, match] of matches.entries()) {
        const start = match.index ?? 0;
        const end =
            index + 1 < matches.length
                ? (matches[index + 1].index ?? markdown.length)
                : markdown.length;
        rewritten += markdown.slice(cursor, start);
        rewritten += rewriteSection(
            markdown.slice(start, end),
            index + 1 < matches.length,
        );
        cursor = end;
    }
    rewritten += markdown.slice(cursor);
    return rewritten;
}

/**
 * Changelog functions Changesets loads from `.changeset/config.json`.
 *
 * Changesets calls the default export. The named exports are the same
 * functions, so tests and `scripts/version-packages.mjs` can call them
 * without going through the default object.
 *
 * @type {{ getReleaseLine: typeof getReleaseLine, getDependencyReleaseLine: typeof getDependencyReleaseLine }}
 */
const changelogFunctions = {
    getReleaseLine,
    getDependencyReleaseLine,
};

export default changelogFunctions;
