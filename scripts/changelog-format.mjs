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
 * @param {string} summary
 * @param {{ name: string, type: string }[]} [releases]
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
 * @param {string} markdown
 * @param {string} filePath
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
 * @param {string | null | undefined} subject
 * @returns {string | null}
 */
export function pullRequestNumberFromCommitSubject(subject) {
    if (!subject) {
        return null;
    }
    const match = /\(#(\d+)\)\s*$/.exec(subject);
    return match ? match[1] : null;
}

/**
 * @param {string | null} pullRequestNumber
 * @param {string | null | undefined} commitHash
 * @param {string} repository
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
 * @param {string | undefined} commitHash
 * @param {Record<string, unknown> | null | undefined} options
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
 * @param {Record<string, unknown> | null | undefined} options
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
 * @param {Record<string, unknown> | null | undefined} options
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
 * @param {{ id?: string, summary: string, releases?: { name: string, type: string }[], commit?: string }} changeset
 * @param {string} _releaseType
 * @param {Record<string, unknown> | null} [options]
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
 * @param {unknown[]} _dependencyChangesets
 * @param {{ name: string, newVersion?: string }[]} dependentReleases
 * @param {Record<string, unknown> | null} [_options]
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
 * @param {string} markdown
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

const changelogFunctions = {
    getReleaseLine,
    getDependencyReleaseLine,
};

export default changelogFunctions;
