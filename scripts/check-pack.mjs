import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");

const deniedFileExpressions = [
    /(^|\/)\.env(\.|$)/,
    /\.test\.[cm]?[jt]sx?$/,
    /(^|\/)eslint\.config\./,
    /(^|\/)tsdown\.config\./,
    /(^|\/)vitest\.config\./,
    /(^|\/)tsconfig.*\.json$/,
    /(^|\/)turbo\.json$/,
    /(^|\/)node_modules\//,
    /(^|\/)coverage\//,
];

const maximumTarballBytes = 1_000_000;

/**
 * @param {string} repositoryDirectory
 * @param {(absolutePath: string, packageManifest: { name?: string, private?: boolean }) => boolean} includePackage
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
            if (depth < 3) {
                walk(absolutePath, depth + 1);
            }
        }
    }

    walk(repositoryDirectory, 0);
    return packageDirectories.sort();
}

/**
 * Packages npm will publish. The workspace root is not one of them.
 * Packages under `packages/config` are private workspace tooling.
 *
 * @param {string} repositoryDirectory
 * @returns {string[]}
 */
export function listPublishablePackages(repositoryDirectory) {
    return listPackageDirectories(
        repositoryDirectory,
        (_absolutePath, packageManifest) =>
            packageManifest.private !== true &&
            packageManifest.name !== "@sgx4u/toolkit",
    );
}

/**
 * Tarball review covers published libraries and the private tooling under
 * `packages/config`. Tooling is not published. publint, attw, and this
 * review still run so a preset cannot grow a test file or a config file
 * in its pack.
 *
 * @param {string} repositoryDirectory
 * @returns {string[]}
 */
export function listPackReviewPackages(repositoryDirectory) {
    return listPackageDirectories(
        repositoryDirectory,
        (absolutePath, packageManifest) => {
            if (packageManifest.name === "@sgx4u/toolkit") {
                return false;
            }
            if (packageManifest.private !== true) {
                return true;
            }
            const relativePath = path
                .relative(repositoryDirectory, absolutePath)
                .split(path.sep)
                .join("/");
            return relativePath.startsWith("packages/config/");
        },
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
 * @param {string} packageDirectory
 * @returns {{ files: string[], sizeBytes: number }}
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
    const packageDirectories = listPackReviewPackages(repositoryRoot);
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
            const denied = deniedFileExpressions.some((expression) =>
                expression.test(filePath),
            );
            if (denied) {
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
