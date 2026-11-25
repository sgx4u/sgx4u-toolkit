import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { rewriteChangelog } from "./changelog-format.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");

/**
 * @param {string[]} [extraArguments]
 * @returns {string[]}
 */
export function versionCommandArguments(extraArguments = []) {
    return ["exec", "changeset", "version", ...extraArguments];
}

/**
 * Changesets writes each library changelog beside that library.
 * The repository root CHANGELOG.md is the toolkit index. It is not a
 * version section, and copying library notes into it would repeat them.
 *
 * @param {string} relativePath
 * @returns {boolean}
 */
export function isLibraryChangelog(relativePath) {
    return relativePath.split(path.sep).join("/") !== "CHANGELOG.md";
}

/**
 * @param {string} rootDirectory
 * @returns {string[]}
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
