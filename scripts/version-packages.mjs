/**
 * Versions published packages and rewrites their changelogs into categories.
 *
 * The release workflow runs `node scripts/version-packages.mjs`. Extra
 * arguments are forwarded to `changeset version`. After that command
 * succeeds, each library `CHANGELOG.md` is rewritten and formatted. The
 * repository root `CHANGELOG.md` is the toolkit index and is left unchanged.
 */

import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { rewriteChangelog } from "./changelog-format.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");

/**
 * Arguments for `pnpm exec changeset version`, plus any extra arguments.
 *
 * The release workflow passes none. Tests pass flags such as `--snapshot`
 * by calling this directly. The default is an empty list, which versions
 * the pending changesets on the current branch.
 *
 * @param {string[]} [extraArguments] Tokens appended after `version`.
 * @returns {string[]}
 * @defaultValue []
 * @example
 * versionCommandArguments(["--snapshot", "beta"])
 */
export function versionCommandArguments(extraArguments = []) {
    return ["exec", "changeset", "version", ...extraArguments];
}

/**
 * True when `relativePath` is a library changelog rather than the toolkit index.
 *
 * Changesets writes each library changelog beside that library. The
 * repository root `CHANGELOG.md` is the index of those files. Copying
 * library notes into it would repeat them, so the root path returns false.
 *
 * @param {string} relativePath Path relative to the repository, with either separator.
 * @returns {boolean}
 * @example
 * isLibraryChangelog("packages/example/CHANGELOG.md")
 */
export function isLibraryChangelog(relativePath) {
    return relativePath.split(path.sep).join("/") !== "CHANGELOG.md";
}

/**
 * Rewrites every library changelog under `rootDirectory` and returns the paths that changed.
 *
 * Files that are already in category form are left on disk. `node_modules`,
 * `dist`, and `.git` are skipped. The root `CHANGELOG.md` is skipped by
 * {@link isLibraryChangelog}.
 *
 * @param {string} rootDirectory Directory to walk. Tests pass a temporary repository.
 * @returns {string[]} Repository-relative paths that were written, sorted.
 * @throws {Error} When {@link rewriteChangelog} rejects a tagged section.
 * @example
 * rewriteChangelogFiles(repositoryRoot)
 */
export function rewriteChangelogFiles(rootDirectory) {
    /** @type {string[]} */
    const relativePaths = [];

    /**
     * @param {string} directory
     */
    function walk(directory) {
        for (const entry of readdirSync(directory, { withFileTypes: true })) {
            if (
                entry.name === "node_modules" ||
                entry.name === "dist" ||
                entry.name === ".git"
            ) {
                continue;
            }
            const absolutePath = path.join(directory, entry.name);
            if (entry.isDirectory()) {
                walk(absolutePath);
                continue;
            }
            if (entry.isFile() && entry.name === "CHANGELOG.md") {
                const relativePath = path
                    .relative(rootDirectory, absolutePath)
                    .split(path.sep)
                    .join("/");
                if (isLibraryChangelog(relativePath)) {
                    relativePaths.push(relativePath);
                }
            }
        }
    }

    walk(rootDirectory);
    /** @type {string[]} */
    const rewritten = [];
    for (const relativePath of relativePaths.sort()) {
        const absolutePath = path.join(rootDirectory, relativePath);
        if (!statSync(absolutePath).isFile()) {
            continue;
        }
        const original = readFileSync(absolutePath, "utf8");
        const updated = rewriteChangelog(original);
        if (updated !== original) {
            writeFileSync(absolutePath, updated);
            rewritten.push(relativePath);
        }
    }
    return rewritten;
}

function main() {
    const versionResult = spawnSync(
        "pnpm",
        versionCommandArguments(process.argv.slice(2)),
        {
            cwd: repositoryRoot,
            stdio: "inherit",
        },
    );
    if ((versionResult.status ?? 1) !== 0) {
        process.exit(versionResult.status ?? 1);
    }

    const rewritten = rewriteChangelogFiles(repositoryRoot);
    if (rewritten.length === 0) {
        return;
    }
    const formatResult = spawnSync(
        "pnpm",
        ["exec", "prettier", "--write", ...rewritten],
        {
            cwd: repositoryRoot,
            stdio: "inherit",
        },
    );
    process.exit(formatResult.status ?? 1);
}

if (
    process.argv[1] &&
    path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
    main();
}
