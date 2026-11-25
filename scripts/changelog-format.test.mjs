import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import {
    copyFileSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    readdirSync,
    statSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
    getDependencyReleaseLine,
    getReleaseLine,
    parseChangesetFile,
    parseChangesetNotes,
    pullRequestNumberFromCommitSubject,
    rewriteChangelog,
} from "./changelog-format.mjs";

const require = createRequire(import.meta.url);
const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));

test("category sections stay in order and empty categories are omitted", () => {
    const notes = parseChangesetNotes(
        [
            "Summary: Helpers for blank text.",
            "",
            "Fixed: `formatLabel` keeps an empty label unchanged.",
            "",
            "Added: `normalizeLabel` returns the label callers display.",
            "",
        ].join("\n"),
        [{ name: "@sgx4u/example", type: "minor" }],
    );
    assert.equal(notes.summary, "Helpers for blank text.");
    assert.deepEqual(
        notes.entries.map((entry) => entry.category),
        ["Fixed", "Added"],
    );

    const releaseLine = getReleaseLine(
        {
            id: "example-notes",
            summary: [
                "Summary: Helpers for blank text.",
                "Fixed: `formatLabel` keeps an empty label unchanged.",
                "Added: `normalizeLabel` returns the label callers display.",
            ].join("\n"),
            releases: [{ name: "@sgx4u/example", type: "minor" }],
            commit: "abcdef1234567890abcdef1234567890abcdef12",
        },
        "minor",
        {
            repository: "sgx4u/sgx4u-toolkit",
            date: "2026-11-25",
            commitSubjects: {
                abcdef1234567890abcdef1234567890abcdef12:
                    "fix: treat non-breaking space as blank (#42)",
            },
        },
    );
    const rewritten = rewriteChangelog(
        `# @sgx4u/example\n\n## 0.1.0\n\n### Minor Changes\n\n${releaseLine.trim()}\n`,
    );
    assert.match(
        rewritten,
        /^# @sgx4u\/example\n\n## 0\.1\.0 — 2026-11-25\n\nHelpers for blank text\.\n\n### Added\n/,
    );
    assert.match(rewritten, /### Added\n\n- `normalizeLabel`/);
    assert.ok(rewritten.indexOf("### Added") < rewritten.indexOf("### Fixed"));
    assert.doesNotMatch(rewritten, /### Minor Changes/);
    assert.doesNotMatch(rewritten, /### Changed/);
    assert.match(
        rewritten,
        /\[#42\]\(https:\/\/github\.com\/sgx4u\/sgx4u-toolkit\/pull\/42\)/,
    );
    assert.equal(rewriteChangelog(rewritten), rewritten);
});

test("a breaking entry indents the migration snippet and rejects a patch bump", () => {
    const summary = [
        "Breaking: `definePackageConfig` requires `rootDir`.",
        "",
        "```js",
        'definePackageConfig({ runtime: "node", rootDir: import.meta.dirname })',
        "```",
        "",
        "Pass the directory of the calling config file.",
        "",
    ].join("\n");
    assert.throws(
        () =>
            parseChangesetNotes(summary, [
                { name: "@sgx4u/example", type: "patch" },
            ]),
        /cannot use a patch bump/,
    );

    const releaseLine = getReleaseLine(
        {
            id: "breaking-option",
            summary,
            releases: [{ name: "@sgx4u/example", type: "minor" }],
        },
        "minor",
        {
            repository: "sgx4u/sgx4u-toolkit",
            date: "2026-11-25",
            commitSubjects: {},
        },
    );
    const rewritten = rewriteChangelog(
        `# @sgx4u/example\n\n## 0.2.0\n\n### Minor Changes\n\n${releaseLine.trim()}\n`,
    );
    assert.match(
        rewritten,
        /### ⚠️ Breaking changes\n\n- `definePackageConfig` requires `rootDir`\.\n\n {4}```js\n {4}definePackageConfig/,
    );
    assert.match(
        rewritten,
        / {4}Pass the directory of the calling config file\./,
    );
    assert.doesNotMatch(rewritten, /### Added/);
});

test("an explicit pull request link wins over the commit subject", () => {
    const releaseLine = getReleaseLine(
        {
            id: "linked",
            summary: [
                "Pull request: 12",
                "Added: `formatLabel` returns the label callers display.",
            ].join("\n"),
            releases: [{ name: "@sgx4u/example", type: "minor" }],
            commit: "1234567890abcdef1234567890abcdef12345678",
        },
        "minor",
        {
            date: "2026-11-25",
            commitSubjects: {
                "1234567890abcdef1234567890abcdef12345678":
                    "feat: add formatLabel (#99)",
            },
        },
    );
    const rewritten = rewriteChangelog(
        `## 0.1.0\n\n### Minor Changes\n\n${releaseLine.trim()}\n`,
    );
    assert.match(rewritten, /\[#12\]/);
    assert.doesNotMatch(rewritten, /#99/);
    assert.doesNotMatch(rewritten, /\/commit\//);
});

test("a commit without a pull request number links to the commit", () => {
    const commitHash = "abc1234deadbeefabc1234deadbeefabc1234d";
    const releaseLine = getReleaseLine(
        {
            id: "commit-only",
            summary: "Added: `formatLabel` returns the label callers display.",
            releases: [{ name: "@sgx4u/example", type: "patch" }],
            commit: commitHash,
        },
        "patch",
        {
            date: "2026-11-25",
            commitSubjects: { [commitHash]: "feat: add formatLabel" },
        },
    );
    const rewritten = rewriteChangelog(
        `## 0.1.1\n\n### Patch Changes\n\n${releaseLine.trim()}\n`,
    );
    assert.match(
        rewritten,
        new RegExp(
            `\\[abc1234\\]\\(https://github.com/sgx4u/sgx4u-toolkit/commit/${commitHash}\\)`,
        ),
    );
    assert.equal(
        pullRequestNumberFromCommitSubject("feat: add formatLabel (#7)"),
        "7",
    );
    assert.equal(
        pullRequestNumberFromCommitSubject("feat: add formatLabel"),
        null,
    );
});

test("dependency updates render under Changed and an older section stays", () => {
    const dependencyLine = getDependencyReleaseLine(
        [],
        [
            { name: "@sgx4u/other", newVersion: "0.2.0" },
            { name: "@sgx4u/another", newVersion: "1.0.0" },
        ],
    );
    const releaseLine = getReleaseLine(
        {
            id: "feature",
            summary: "Added: `formatLabel` returns the label callers display.",
            releases: [{ name: "@sgx4u/example", type: "minor" }],
        },
        "minor",
        { date: "2026-11-25", commitSubjects: {} },
    );
    const rewritten = rewriteChangelog(
        [
            "# @sgx4u/example",
            "",
            "## 0.2.0",
            "",
            "### Minor Changes",
            "",
            releaseLine.trim(),
            "",
            "### Patch Changes",
            "",
            dependencyLine.trim(),
            "",
            "## 0.1.0",
            "",
            "### Patch Changes",
            "",
            "- Older note.",
            "",
        ].join("\n"),
    );
    assert.match(rewritten, /## 0\.2\.0 — 2026-11-25/);
    assert.ok(
        rewritten.indexOf("### Added") < rewritten.indexOf("### Changed"),
    );
    assert.match(rewritten, /- `@sgx4u\/another` is updated to `1\.0\.0`\./);
    assert.match(rewritten, /- `@sgx4u\/other` is updated to `0\.2\.0`\./);
    assert.match(
        rewritten,
        /## 0\.1\.0\n\n### Patch Changes\n\n- Older note\.\n/,
    );
});

test("notes without a category are rejected", () => {
    assert.throws(
        () => parseChangesetNotes("Document the helper.\n"),
        /category tag/,
    );
    assert.throws(
        () =>
            parseChangesetNotes(
                "Added: formatLabel returns the label callers display.\n",
            ),
        /backticks/,
    );
});

test("pending changesets use the category format", () => {
    const directory = fileURLToPath(new URL("../.changeset/", import.meta.url));
    const names = readdirSync(directory).filter(
        (name) => name.endsWith(".md") && name !== "README.md",
    );
    for (const name of names) {
        const markdown = readFileSync(path.join(directory, name), "utf8");
        const parsed = parseChangesetFile(markdown, `.changeset/${name}`);
        assert.ok(parsed.notes.summary);
        assert.ok(parsed.notes.entries.length > 0);
    }
});

test("changeset version output is rewritten into category sections", () => {
    const changesetCli = require.resolve("@changesets/cli/bin.js");
    const rootDirectory = mkdtempSync(path.join(tmpdir(), "sgx4u-changelog-"));
    mkdirSync(path.join(rootDirectory, ".changeset"), { recursive: true });
    mkdirSync(path.join(rootDirectory, "scripts"), { recursive: true });
    copyFileSync(
        fileURLToPath(new URL("./changelog-format.mjs", import.meta.url)),
        path.join(rootDirectory, "scripts", "changelog-format.mjs"),
    );
    writeFileSync(
        path.join(rootDirectory, "package.json"),
        `${JSON.stringify(
            {
                name: "@sgx4u/example",
                version: "0.0.0",
                private: false,
            },
            null,
            4,
        )}\n`,
    );
    writeFileSync(
        path.join(rootDirectory, ".changeset", "config.json"),
        `${JSON.stringify(
            {
                changelog: [
                    "../scripts/changelog-format.mjs",
                    { repository: "sgx4u/sgx4u-toolkit" },
                ],
                commit: false,
                access: "public",
                baseBranch: "main",
                format: false,
            },
            null,
            4,
        )}\n`,
    );
    writeFileSync(
        path.join(rootDirectory, ".changeset", "demo.md"),
        [
            "---",
            '"@sgx4u/example": minor',
            "---",
            "",
            "Summary: First release of the example package.",
            "",
            "Pull request: 12",
            "",
            "Added: `formatLabel` returns the label callers display.",
            "",
        ].join("\n"),
    );
    runGit(rootDirectory, ["init", "-b", "main"]);
    runGit(rootDirectory, ["config", "user.email", "test@example.com"]);
    runGit(rootDirectory, ["config", "user.name", "Changeset Test"]);
    runGit(rootDirectory, ["add", "."]);
    runGit(rootDirectory, ["commit", "-m", "feat: add the example package"]);

    const result = spawnSync(process.execPath, [changesetCli, "version"], {
        cwd: rootDirectory,
        encoding: "utf8",
    });
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    const intermediate = readFileSync(
        path.join(rootDirectory, "CHANGELOG.md"),
        "utf8",
    );
    assert.match(intermediate, /### Minor Changes/);
    assert.match(intermediate, /<!-- changelog-entry: Added -->/);
    const rewritten = rewriteChangelog(intermediate);
    assert.match(
        rewritten,
        /^# @sgx4u\/example\n\n## 0\.1\.0 — \d{4}-\d{2}-\d{2}\n\nFirst release of the example package\.\n\n### Added\n\n- `formatLabel` returns the label callers display\. \(\[#12\]\(https:\/\/github\.com\/sgx4u\/sgx4u-toolkit\/pull\/12\)\)\n$/,
    );
    assert.equal(
        JSON.parse(
            readFileSync(path.join(rootDirectory, "package.json"), "utf8"),
        ).version,
        "0.1.0",
    );
});

test("contribution docs do not name the removed scope or its check", () => {
    const files = documentationFiles(repositoryRoot);
    for (const relativePath of files) {
        const text = readFileSync(
            path.join(repositoryRoot, relativePath),
            "utf8",
        );
        const forbiddenScope = "@sgx4u-" + "private";
        const forbiddenCheck = "check-" + "visibility";
        assert.equal(text.includes(forbiddenScope), false, relativePath);
        assert.equal(text.includes(forbiddenCheck), false, relativePath);
    }
});

/**
 * @param {string} rootDirectory
 * @param {string[]} gitArguments
 */
function runGit(rootDirectory, gitArguments) {
    const result = spawnSync("git", gitArguments, {
        cwd: rootDirectory,
        encoding: "utf8",
    });
    assert.equal(
        result.status,
        0,
        `${gitArguments.join(" ")}\n${result.stderr}`,
    );
    return result.stdout;
}

/**
 * @param {string} rootDirectory
 * @returns {string[]}
 */
function documentationFiles(rootDirectory) {
    /** @type {string[]} */
    const files = [];
    for (const relativePath of [
        "CONTRIBUTING.md",
        "README.md",
        "CHANGELOG.md",
        ".changeset",
    ]) {
        collectMarkdown(rootDirectory, relativePath, files);
    }
    return files;
}

/**
 * @param {string} rootDirectory
 * @param {string} relativePath
 * @param {string[]} files
 */
function collectMarkdown(rootDirectory, relativePath, files) {
    const absolutePath = path.join(rootDirectory, relativePath);
    if (statSync(absolutePath).isFile()) {
        if (relativePath.endsWith(".md")) {
            files.push(relativePath.split(path.sep).join("/"));
        }
        return;
    }
    for (const entry of readdirSync(absolutePath, { withFileTypes: true })) {
        collectMarkdown(
            rootDirectory,
            path.posix.join(relativePath, entry.name),
            files,
        );
    }
}
