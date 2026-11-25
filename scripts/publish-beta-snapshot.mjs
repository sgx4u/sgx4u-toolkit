import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");

/**
 * @param {string} parentDirectory
 * @param {Map<string, string>} versions
 */
function collectPackageVersions(parentDirectory, versions) {
    if (
        !existsSync(parentDirectory) ||
        !statSync(parentDirectory).isDirectory()
    ) {
        return;
    }
    for (const packageDirectoryName of readdirSync(parentDirectory)) {
        const manifestPath = path.join(
            parentDirectory,
            packageDirectoryName,
            "package.json",
        );
        let manifestText;
        try {
            if (!statSync(manifestPath).isFile()) {
                continue;
            }
            manifestText = readFileSync(manifestPath, "utf8");
        } catch {
            continue;
        }
        const packageManifest = JSON.parse(manifestText);
        if (
            packageManifest.private === true ||
            typeof packageManifest.name !== "string"
        ) {
            continue;
        }
        versions.set(packageManifest.name, String(packageManifest.version));
    }
}

/**
 * @param {string} rootDirectory
 * @returns {Map<string, string>}
 */
export function readPackageVersions(rootDirectory) {
    /** @type {Map<string, string>} */
    const versions = new Map();
    const packagesDirectory = path.join(rootDirectory, "packages");
    collectPackageVersions(packagesDirectory, versions);
    collectPackageVersions(path.join(packagesDirectory, "config"), versions);
    return versions;
}

/**
 * @param {Map<string, string>} versionsBefore
 * @param {Map<string, string>} versionsAfter
 * @returns {{ packageName: string, version: string }[]}
 */
export function packagesWithChangedVersions(versionsBefore, versionsAfter) {
    /** @type {{ packageName: string, version: string }[]} */
    const changed = [];
    for (const [packageName, version] of versionsAfter) {
        if (versionsBefore.get(packageName) !== version) {
            changed.push({ packageName, version });
        }
    }
    return changed;
}

function main() {
    const versionsBefore = readPackageVersions(repositoryRoot);
    execFileSync(
        "pnpm",
        ["exec", "changeset", "version", "--snapshot", "beta"],
        {
            cwd: repositoryRoot,
            stdio: "inherit",
        },
    );
    const changed = packagesWithChangedVersions(
        versionsBefore,
        readPackageVersions(repositoryRoot),
    );
    if (changed.length === 0) {
        console.log(
            "No pending changesets. Nothing published to the beta tag.",
        );
        return;
    }
    for (const { packageName, version } of changed) {
        console.log(`Publishing ${packageName}@${version} with dist-tag beta.`);
        execFileSync(
            "pnpm",
            [
                "--filter",
                packageName,
                "publish",
                "--tag",
                "beta",
                "--no-git-checks",
                "--access",
                "public",
            ],
            { cwd: repositoryRoot, stdio: "inherit" },
        );
    }
}

if (
    process.argv[1] &&
    path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
    main();
}
