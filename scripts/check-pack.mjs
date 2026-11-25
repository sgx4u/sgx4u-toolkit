/**
 * Fails when a publishable package would pack a forbidden file or grow past
 * the review cap.
 *
 * The release workflow and `pnpm check` run `node scripts/check-pack.mjs`
 * after the packages are built. Private packages and `packages/config` are
 * skipped. The preview is `pnpm pack --dry-run`, so nothing is uploaded.
 */

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");

// Repository and test files. A published tarball must leave these behind.
// Function usage guides under `src` stay in the repository. The package
// README at the tarball root is the published prose.
const deniedFileExpressions = [
    /(^|\/)\.env(\.|$)/,
    /\.test\.[cm]?[jt]sx?$/,
    /(^|\/)src\/.*\.md$/,
    /(^|\/)eslint\.config\./,
    /(^|\/)tsdown\.config\./,
    /(^|\/)vitest\.config\./,
    /(^|\/)tsconfig.*\.json$/,
    /(^|\/)turbo\.json$/,
    /(^|\/)node_modules\//,
    /(^|\/)coverage\//,
];

// Pack review fails above this size so a library tarball stays small enough to inspect.
const maximumTarballBytes = 1_000_000;

/**
 * @param {string} repositoryDirectory
 * @param {(absolutePath: string, packageManifest: { private?: boolean }) => boolean} includePackage
 * @returns {string[]}
 */
function listPackageDirectories(repositoryDirectory, includePackage) {
    /** @type {string[]} */
    const packageDirectories = [];

    /**
     * @param {string} directory
     * @param {number} depth
     */
    function walk(directory, depth) {
        for (const entry of readdirSync(directory, { withFileTypes: true })) {
            if (
                entry.name === "node_modules" ||
                entry.name === "dist" ||
                entry.name === ".git"
            ) {
                continue;
            }
            const absolutePath = path.join(directory, entry.name);
            if (!entry.isDirectory()) {
                continue;
            }
            const manifestPath = path.join(absolutePath, "package.json");
            if (statExists(manifestPath)) {
                const packageManifest = JSON.parse(
                    readFileSync(manifestPath, "utf8"),
                );
                if (includePackage(absolutePath, packageManifest)) {
                    packageDirectories.push(absolutePath);
                }
                continue;
            }
            // Descend through `packages/` and `packages/config/`, then stop.
            // A folder inside a package is not another package.
            if (depth < 3) {
                walk(absolutePath, depth + 1);
            }
        }
    }

    walk(repositoryDirectory, 0);
    return packageDirectories.sort();
}

/**
 * @param {string} repositoryDirectory
 * @param {string} absolutePath
 * @param {{ private?: boolean }} packageManifest
 * @returns {boolean}
 */
function isPublishablePackage(
    repositoryDirectory,
    absolutePath,
    packageManifest,
) {
    if (packageManifest.private === true) {
        return false;
    }
    const relativePath = path
        .relative(repositoryDirectory, absolutePath)
        .split(path.sep)
        .join("/");
    return !relativePath.startsWith("packages/config/");
}

/**
 * Absolute directories of packages npm will publish.
 *
 * Use this before a pack preview. The workspace root is not included.
 * `"private": true` and anything under `packages/config/` are workspace
 * tooling and are omitted. The walk stops at package depth so a nested
 * folder inside a library is not treated as another package.
 *
 * @param {string} repositoryDirectory Repository root.
 * @returns {string[]} Absolute paths, sorted.
 * @example
 * listPublishablePackages(repositoryRoot)
 */
export function listPublishablePackages(repositoryDirectory) {
    return listPackageDirectories(
        repositoryDirectory,
        (absolutePath, packageManifest) =>
            isPublishablePackage(
                repositoryDirectory,
                absolutePath,
                packageManifest,
            ),
    );
}

/**
 * Whether a path inside a pack preview must not be published.
 *
 * Tests and function usage guides under `src` match, along with config
 * files and dependency folders. `README.md` at the package root does not.
 *
 * @param {string} filePath Path as `pnpm pack` reports it, using `/`.
 * @returns {boolean} `true` when the pack check should fail for this path.
 * @example
 * isDeniedPackPath("src/package-identifier/package-identifier.md")
 */
export function isDeniedPackPath(filePath) {
    return deniedFileExpressions.some((expression) =>
        expression.test(filePath),
    );
}

/**
 * @param {string} filePath
 */
function statExists(filePath) {
    try {
        return statSync(filePath).isFile();
    } catch {
        return false;
    }
}

/**
 * Files and byte size `pnpm pack` would put in the tarball.
 *
 * The command is `--dry-run`, so npm receives nothing. pnpm prints either
 * one preview object or an array whose first entry is the preview.
 *
 * @param {string} packageDirectory Absolute package directory. The package must already be built when the tarball includes `dist`.
 * @returns {{ files: string[], sizeBytes: number }} Paths as pnpm reports them, and the tarball size in bytes.
 * @throws {Error} When `pnpm pack` exits non-zero, or when the output is not JSON.
 * @example
 * readPackPreview(packageDirectory)
 */
export function readPackPreview(packageDirectory) {
    const output = execFileSync("pnpm", ["pack", "--dry-run", "--json"], {
        cwd: packageDirectory,
        encoding: "utf8",
    });
    const parsed = JSON.parse(output);
    const preview = Array.isArray(parsed) ? parsed[0] : parsed;
    const files = (preview.files ?? []).map((file) => file.path ?? file);
    const sizeBytes = Number(preview.size ?? 0);
    return { files, sizeBytes };
}

function main() {
    const packageDirectories = listPublishablePackages(repositoryRoot);
    let failed = false;

    for (const packageDirectory of packageDirectories) {
        const relativeDirectory = path.relative(
            repositoryRoot,
            packageDirectory,
        );
        const preview = readPackPreview(packageDirectory);
        if (preview.sizeBytes > maximumTarballBytes) {
            console.error(
                `${relativeDirectory} pack is ${preview.sizeBytes} bytes, above the ${maximumTarballBytes} byte review cap.`,
            );
            failed = true;
        }

        for (const filePath of preview.files) {
            if (isDeniedPackPath(filePath)) {
                console.error(
                    `${relativeDirectory} pack includes ${filePath}, which is not publishable.`,
                );
                failed = true;
            }
        }
    }

    if (failed) {
        process.exitCode = 1;
    }
}

if (
    process.argv[1] &&
    path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
    main();
}
