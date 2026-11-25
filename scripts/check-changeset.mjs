import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseChangesetFile } from "./changelog-format.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");

const contractFieldNames = [
    "name",
    "type",
    "sideEffects",
    "private",
    "main",
    "module",
    "types",
    "exports",
    "imports",
    "files",
    "bin",
    "dependencies",
    "peerDependencies",
    "optionalDependencies",
    "peerDependenciesMeta",
    "engines",
    "os",
    "cpu",
    "publishConfig",
];

/**
 * @param {string} rootDirectory
 * @param {string[]} gitArguments
 */
function gitOutput(rootDirectory, gitArguments) {
    const result = spawnSync("git", gitArguments, {
        cwd: rootDirectory,
        encoding: "utf8",
    });
    if (result.status !== 0) {
        const detail = (result.stderr || result.stdout || "").trim();
        throw new Error(
            detail ||
                `git ${gitArguments.join(" ")} failed in ${rootDirectory}`,
        );
    }
    return result.stdout;
}

/**
 * @param {string} line
 */
function normalizeGitPath(line) {
    let relativePath = line.trim();
    if (relativePath.startsWith('"') && relativePath.endsWith('"')) {
        relativePath = relativePath.slice(1, -1);
    }
    return relativePath.replaceAll("\\", "/");
}

/**
 * @param {string} rootDirectory
 * @param {string} baseRef
 * @returns {string[]}
 */
export function listChangedPaths(rootDirectory, baseRef) {
    const diff = gitOutput(rootDirectory, [
        "diff",
        "--name-only",
        "--diff-filter=ACMRD",
        baseRef,
    ]);
    const untracked = gitOutput(rootDirectory, [
        "ls-files",
        "--others",
        "--exclude-standard",
    ]);
    /** @type {Set<string>} */
    const paths = new Set();
    for (const line of `${diff}\n${untracked}`.split("\n")) {
        const relativePath = normalizeGitPath(line);
        if (relativePath) {
            paths.add(relativePath);
        }
    }
    return [...paths].sort();
}

/**
 * @param {unknown} value
 */
function stableJson(value) {
    if (Array.isArray(value)) {
        return value.map((item) => stableJson(item));
    }
    if (value && typeof value === "object") {
        /** @type {Record<string, unknown>} */
        const sorted = {};
        for (const key of Object.keys(value).sort()) {
            sorted[key] = stableJson(
                /** @type {Record<string, unknown>} */ (value)[key],
            );
        }
        return sorted;
    }
    return value;
}

/**
 * @param {unknown} left
 * @param {unknown} right
 */
function sameJson(left, right) {
    return (
        JSON.stringify(stableJson(left)) === JSON.stringify(stableJson(right))
    );
}

/**
 * @param {string} relativePath
 */
export function isTestPath(relativePath) {
    return /(?:^|\/)[^/]+\.(?:test|spec)\.[cm]?[jt]sx?$/.test(relativePath);
}

/**
 * @param {string} relativePath
 */
function isMarkdownPath(relativePath) {
    return relativePath.toLowerCase().endsWith(".md");
}

/**
 * @param {string} value
 */
function escapeRegularExpression(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * @param {string} relativePath
 * @param {string} pattern
 */
function fileMatchesPattern(relativePath, pattern) {
    const normalized = pattern.replace(/^\.\//, "").replace(/\/$/, "");
    if (!normalized.includes("*")) {
        return (
            relativePath === normalized ||
            relativePath.startsWith(`${normalized}/`)
        );
    }
    const expression = normalized
        .split("**")
        .map((part) =>
            part.split("*").map(escapeRegularExpression).join("[^/]*"),
        )
        .join(".*");
    return new RegExp(`^${expression}$`).test(relativePath);
}

/**
 * @param {string} relativePath
 * @param {string[]} filesField
 */
function matchesFilesField(relativePath, filesField) {
    let included = false;
    for (const pattern of filesField) {
        if (typeof pattern !== "string") {
            continue;
        }
        const negated = pattern.startsWith("!");
        const rawPattern = negated ? pattern.slice(1) : pattern;
        if (fileMatchesPattern(relativePath, rawPattern)) {
            included = !negated;
        }
    }
    return included;
}

/**
 * @param {unknown} value
 * @param {Set<string>} paths
 */
function collectExportPaths(value, paths) {
    if (typeof value === "string") {
        if (value.startsWith("./")) {
            paths.add(value.slice(2));
        }
        return;
    }
    if (!value || typeof value !== "object") {
        return;
    }
    for (const nested of Object.values(value)) {
        collectExportPaths(nested, paths);
    }
}

/**
 * @param {string} relativePath
 * @param {Record<string, unknown>} packageManifest
 */
function isPublishedPath(relativePath, packageManifest) {
    const filesField = packageManifest.files;
    if (
        Array.isArray(filesField) &&
        matchesFilesField(relativePath, filesField)
    ) {
        return true;
    }
    /** @type {Set<string>} */
    const exportPaths = new Set();
    collectExportPaths(packageManifest.exports, exportPaths);
    if (exportPaths.has(relativePath)) {
        return true;
    }
    return !Array.isArray(filesField);
}

/**
 * @param {Record<string, unknown> | null} beforeManifest
 * @param {Record<string, unknown> | null} afterManifest
 * @returns {string[]}
 */
export function contractFieldChanges(beforeManifest, afterManifest) {
    /** @type {string[]} */
    const changed = [];
    for (const fieldName of contractFieldNames) {
        const beforeValue = beforeManifest
            ? beforeManifest[fieldName]
            : undefined;
        const afterValue = afterManifest ? afterManifest[fieldName] : undefined;
        if (!sameJson(beforeValue, afterValue)) {
            changed.push(fieldName);
        }
    }
    return changed;
}

/**
 * Why a path inside a package needs a changeset, or null when it does not.
 *
 * @param {string} relativeToPackage
 * @param {Record<string, unknown> | null} beforeManifest
 * @param {Record<string, unknown> | null} afterManifest
 * @returns {string | null}
 */
export function userVisibleChangeReason(
    relativeToPackage,
    beforeManifest,
    afterManifest,
) {
    if (isMarkdownPath(relativeToPackage) || isTestPath(relativeToPackage)) {
        return null;
    }
    const packageManifest = afterManifest ?? beforeManifest;
    if (!packageManifest || packageManifest.private === true) {
        return null;
    }
    if (relativeToPackage === "package.json") {
        if (!beforeManifest) {
            return "new package";
        }
        if (!afterManifest) {
            return "removed package";
        }
        const fields = contractFieldChanges(beforeManifest, afterManifest);
        if (fields.length === 0) {
            return null;
        }
        return `package.json ${fields.join(", ")}`;
    }
    if (relativeToPackage === "src" || relativeToPackage.startsWith("src/")) {
        return "source";
    }
    if (isPublishedPath(relativeToPackage, packageManifest)) {
        return "published file";
    }
    return null;
}

/**
 * @param {string} rootDirectory
 * @param {string} relativePath
 * @returns {Record<string, unknown> | null}
 */
function readWorktreeManifest(rootDirectory, relativePath) {
    const absolutePath = path.join(rootDirectory, relativePath);
    if (!existsSync(absolutePath)) {
        return null;
    }
    return JSON.parse(readFileSync(absolutePath, "utf8"));
}

/**
 * @param {string} rootDirectory
 * @param {string} baseRef
 * @param {string} relativePath
 * @returns {Record<string, unknown> | null}
 */
function readBaseManifest(rootDirectory, baseRef, relativePath) {
    const result = spawnSync("git", ["show", `${baseRef}:${relativePath}`], {
        cwd: rootDirectory,
        encoding: "utf8",
    });
    if (result.status !== 0) {
        return null;
    }
    return JSON.parse(result.stdout);
}

/**
 * @param {string} directory
 */
function parentDirectory(directory) {
    const parent = directory.includes("/")
        ? directory.slice(0, directory.lastIndexOf("/"))
        : "";
    return parent;
}

/**
 * @param {string} relativeDirectory
 */
export function isWorkspaceToolingPath(relativeDirectory) {
    return (
        relativeDirectory === "packages/config" ||
        relativeDirectory.startsWith("packages/config/")
    );
}

/**
 * @param {string} rootDirectory
 * @param {string} baseRef
 * @param {string} relativePath
 * @param {Map<string, { directory: string, before: Record<string, unknown> | null, after: Record<string, unknown> | null }>} cache
 */
function findPackage(rootDirectory, baseRef, relativePath, cache) {
    let directory = relativePath.includes("/")
        ? relativePath.slice(0, relativePath.lastIndexOf("/"))
        : "";
    while (directory.startsWith("packages")) {
        const cached = cache.get(directory);
        if (cached) {
            return cached;
        }
        const manifestPath = `${directory}/package.json`;
        const after = readWorktreeManifest(rootDirectory, manifestPath);
        const before = readBaseManifest(rootDirectory, baseRef, manifestPath);
        if (after || before) {
            const found = { directory, before, after };
            cache.set(directory, found);
            return found;
        }
        const nextDirectory = parentDirectory(directory);
        if (nextDirectory === directory) {
            break;
        }
        directory = nextDirectory;
    }
    return null;
}

/**
 * @param {string} rootDirectory
 * @param {string} baseRef
 * @returns {{ packageName: string, files: { relativePath: string, reason: string }[] }[]}
 */
export function findUserVisibleChanges(rootDirectory, baseRef) {
    const changedPaths = listChangedPaths(rootDirectory, baseRef);
    /** @type {Map<string, { packageName: string, files: { relativePath: string, reason: string }[] }>} */
    const changes = new Map();
    /** @type {Map<string, { directory: string, before: Record<string, unknown> | null, after: Record<string, unknown> | null }>} */
    const packageCache = new Map();

    for (const relativePath of changedPaths) {
        if (!relativePath.startsWith("packages/")) {
            continue;
        }
        const packageInfo = findPackage(
            rootDirectory,
            baseRef,
            relativePath,
            packageCache,
        );
        if (!packageInfo) {
            continue;
        }
        if (isWorkspaceToolingPath(packageInfo.directory)) {
            continue;
        }
        const packageManifest = packageInfo.after ?? packageInfo.before;
        if (!packageManifest || packageManifest.private === true) {
            continue;
        }
        const relativeToPackage = relativePath.slice(
            packageInfo.directory.length + 1,
        );
        const reason = userVisibleChangeReason(
            relativeToPackage,
            packageInfo.before,
            packageInfo.after,
        );
        if (!reason) {
            continue;
        }
        const packageName =
            typeof packageManifest.name === "string"
                ? packageManifest.name
                : packageInfo.directory;
        const existing = changes.get(packageName);
        const file = { relativePath, reason };
        if (existing) {
            existing.files.push(file);
        } else {
            changes.set(packageName, { packageName, files: [file] });
        }
    }
    return [...changes.values()];
}

/**
 * @param {string} rootDirectory
 * @returns {string[]}
 */
function pendingChangesetPaths(rootDirectory) {
    const directory = path.join(rootDirectory, ".changeset");
    if (!existsSync(directory)) {
        return [];
    }
    return readdirSync(directory)
        .filter((name) => name.endsWith(".md") && name !== "README.md")
        .map((name) => `.changeset/${name}`)
        .sort();
}

/**
 * @param {string} rootDirectory
 * @returns {{ name: string, directory: string, private: boolean }[]}
 */
function workspacePackages(rootDirectory) {
    /** @type {{ name: string, directory: string, private: boolean }[]} */
    const packages = [];

    /**
     * @param {string} directory
     */
    function walk(directory) {
        if (!existsSync(directory)) {
            return;
        }
        for (const entry of readdirSync(directory, { withFileTypes: true })) {
            if (entry.name === "node_modules" || entry.name === "dist") {
                continue;
            }
            const absolutePath = path.join(directory, entry.name);
            if (!entry.isDirectory()) {
                continue;
            }
            const manifestPath = path.join(absolutePath, "package.json");
            if (existsSync(manifestPath)) {
                const packageManifest = JSON.parse(
                    readFileSync(manifestPath, "utf8"),
                );
                const relativeDirectory = path
                    .relative(rootDirectory, absolutePath)
                    .split(path.sep)
                    .join("/");
                if (typeof packageManifest.name === "string") {
                    packages.push({
                        name: packageManifest.name,
                        directory: relativeDirectory,
                        private: packageManifest.private === true,
                    });
                }
                continue;
            }
            walk(absolutePath);
        }
    }

    walk(path.join(rootDirectory, "packages"));
    return packages;
}

/**
 * @param {string} rootDirectory
 * @returns {string[]}
 */
function validateChangesetFiles(rootDirectory) {
    const packages = workspacePackages(rootDirectory);
    const packagesByName = new Map(
        packages.map((packageInfo) => [packageInfo.name, packageInfo]),
    );
    /** @type {string[]} */
    const problems = [];
    for (const relativePath of pendingChangesetPaths(rootDirectory)) {
        try {
            const parsed = parseChangesetFile(
                readFileSync(path.join(rootDirectory, relativePath), "utf8"),
                relativePath,
            );
            for (const release of parsed.releases) {
                const packageInfo = packagesByName.get(release.name);
                if (!packageInfo) {
                    problems.push(
                        `${relativePath} lists ${release.name}, which is not a workspace package.`,
                    );
                    continue;
                }
                if (
                    packageInfo.private ||
                    isWorkspaceToolingPath(packageInfo.directory)
                ) {
                    problems.push(
                        `${relativePath} lists ${release.name}. Packages under packages/config are workspace tooling and are not published, so they do not get a changeset.`,
                    );
                }
            }
        } catch (error) {
            problems.push(
                error instanceof Error ? error.message : String(error),
            );
        }
    }
    return problems;
}

/**
 * @param {string} rootDirectory
 * @returns {string[]}
 */
function publicToolingProblems(rootDirectory) {
    /** @type {string[]} */
    const problems = [];
    for (const packageInfo of workspacePackages(rootDirectory)) {
        if (
            isWorkspaceToolingPath(packageInfo.directory) &&
            !packageInfo.private
        ) {
            problems.push(
                `${packageInfo.directory} is workspace tooling and must set "private": true so it is not published.`,
            );
        }
    }
    return problems;
}

/**
 * @param {string} labels
 */
export function hasNoChangesetLabel(labels) {
    return labels
        .split(",")
        .map((label) => label.trim())
        .filter((label) => label.length > 0)
        .includes("no-changeset");
}

/**
 * @param {string[]} changedPaths
 * @param {string} rootDirectory
 */
function changedChangesetPaths(changedPaths, rootDirectory) {
    return changedPaths.filter((relativePath) => {
        if (
            !relativePath.startsWith(".changeset/") ||
            !relativePath.endsWith(".md")
        ) {
            return false;
        }
        if (relativePath === ".changeset/README.md") {
            return false;
        }
        const remainder = relativePath.slice(".changeset/".length);
        if (remainder.includes("/")) {
            return false;
        }
        return existsSync(path.join(rootDirectory, relativePath));
    });
}

/**
 * @param {{ packageName: string, files: { relativePath: string, reason: string }[] }} change
 */
function formatMissingChange(change) {
    const fileLines = change.files
        .map((file) => `  ${file.relativePath} (${file.reason})`)
        .join("\n");
    return [
        `${change.packageName} changed published behavior and this branch does not add or update a changeset for it:`,
        fileLines,
        "Add a changeset, or update the pending one, using the categories in .changeset/README.md.",
        "For a comment-only edit or an internal refactor, add the no-changeset label instead.",
    ].join("\n");
}

/**
 * @param {string} rootDirectory
 * @param {string} baseRef
 * @param {string} labels
 * @returns {{ accepted: boolean, problems: string[], notices: string[] }}
 */
export function evaluateChangesetRequirement(rootDirectory, baseRef, labels) {
    const problems = [
        ...validateChangesetFiles(rootDirectory),
        ...publicToolingProblems(rootDirectory),
    ];
    if (problems.length > 0) {
        return { accepted: false, problems, notices: [] };
    }
    if (hasNoChangesetLabel(labels)) {
        return {
            accepted: true,
            problems: [],
            notices: [
                "The no-changeset label is set, so this pull request does not need a changeset.",
            ],
        };
    }

    const changes = findUserVisibleChanges(rootDirectory, baseRef);
    if (changes.length === 0) {
        return {
            accepted: true,
            problems: [],
            notices: [
                "No published package behavior changed, so a changeset is not required.",
            ],
        };
    }

    const covered = new Set();
    for (const relativePath of changedChangesetPaths(
        listChangedPaths(rootDirectory, baseRef),
        rootDirectory,
    )) {
        const parsed = parseChangesetFile(
            readFileSync(path.join(rootDirectory, relativePath), "utf8"),
            relativePath,
        );
        for (const release of parsed.releases) {
            covered.add(release.name);
        }
    }

    /** @type {string[]} */
    const missing = [];
    for (const change of changes) {
        if (!covered.has(change.packageName)) {
            missing.push(formatMissingChange(change));
        }
    }
    if (missing.length > 0) {
        return { accepted: false, problems: missing, notices: [] };
    }
    return {
        accepted: true,
        problems: [],
        notices: ["Changesets cover the published package changes."],
    };
}

/**
 * @param {string[]} argv
 */
export function readCommandOptions(argv) {
    let baseRef = "";
    let labels = "";
    for (let index = 0; index < argv.length; index += 1) {
        const argument = argv[index];
        if (argument === "--base") {
            baseRef = argv[index + 1] ?? "";
            index += 1;
            continue;
        }
        if (argument === "--labels") {
            labels = argv[index + 1] ?? "";
            index += 1;
            continue;
        }
        throw new Error(`Unknown argument ${argument}.`);
    }
    if (!baseRef) {
        throw new Error("Pass --base <ref>. Example: --base origin/develop");
    }
    return { baseRef, labels };
}

function main() {
    try {
        const options = readCommandOptions(process.argv.slice(2));
        const result = evaluateChangesetRequirement(
            repositoryRoot,
            options.baseRef,
            options.labels,
        );
        for (const notice of result.notices) {
            console.log(notice);
        }
        if (result.problems.length > 0) {
            for (const problem of result.problems) {
                console.error(problem);
            }
            process.exitCode = 1;
        }
    } catch (error) {
        console.error(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
    }
}

if (
    process.argv[1] &&
    path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
    main();
}
