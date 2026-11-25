import { execFileSync } from "node:child_process";
import {
    existsSync,
    readdirSync,
    readFileSync,
    statSync,
    unlinkSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");

/**
 * Snapshots publish only from beta. develop and production must not rewrite
 * versions. A committed prerelease on those branches would ship as latest.
 * An empty branch name is allowed for a local dry run. GitHub Actions sets
 * GITHUB_REF_NAME on every workflow run, so a job on the wrong branch fails.
 *
 * @param {string | undefined} branchName
 */
export function assertBetaSnapshotBranch(branchName) {
    if (
        branchName === "beta" ||
        branchName === undefined ||
        branchName === ""
    ) {
        return;
    }
    throw new Error(
        `Refusing to publish a beta snapshot from "${branchName}". Snapshots run on the beta branch only, and the prerelease versions are not committed.`,
    );
}

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

/**
 * @param {string} rootDirectory
 * @param {string} relativePath
 */
function isTracked(rootDirectory, relativePath) {
    try {
        execFileSync(
            "git",
            ["ls-files", "--error-unmatch", "--", relativePath],
            {
                cwd: rootDirectory,
                stdio: "ignore",
            },
        );
        return true;
    } catch {
        return false;
    }
}

/**
 * Changesets writes a new CHANGELOG.md when the package does not have one.
 * Those files are untracked. Leave every other untracked file alone.
 *
 * @param {string} rootDirectory
 */
function removeUntrackedChangelogs(rootDirectory) {
    const parentDirectories = [
        path.join(rootDirectory, "packages"),
        path.join(rootDirectory, "packages", "config"),
    ];

    for (const parentDirectory of parentDirectories) {
        if (
            !existsSync(parentDirectory) ||
            !statSync(parentDirectory).isDirectory()
        ) {
            continue;
        }

        for (const entryName of readdirSync(parentDirectory)) {
            const changelogPath = path.join(
                parentDirectory,
                entryName,
                "CHANGELOG.md",
            );
            if (
                !existsSync(changelogPath) ||
                !statSync(changelogPath).isFile()
            ) {
                continue;
            }
            const relativePath = path.relative(rootDirectory, changelogPath);
            if (!isTracked(rootDirectory, relativePath)) {
                unlinkSync(changelogPath);
            }
        }
    }
}

/**
 * Snapshot version bumps exist only so npm can publish them.
 * Restoring the checkout means a later step cannot commit them onto beta,
 * where a graduation pull request could carry them into develop.
 *
 * @param {string} rootDirectory
 */
function discardUncommittedSnapshotEdits(rootDirectory) {
    execFileSync(
        "git",
        [
            "restore",
            "--source=HEAD",
            "--worktree",
            "--staged",
            "--",
            "package.json",
            "pnpm-lock.yaml",
            "packages",
            ".changeset",
        ],
        { cwd: rootDirectory, stdio: "inherit" },
    );
    removeUntrackedChangelogs(rootDirectory);
    const status = execFileSync(
        "git",
        [
            "status",
            "--porcelain",
            "--",
            "package.json",
            "pnpm-lock.yaml",
            "packages",
            ".changeset",
        ],
        { cwd: rootDirectory, encoding: "utf8" },
    );
    if (status.trim() !== "") {
        throw new Error(
            `Snapshot version bumps are still present and must not be committed:\n${status}`,
        );
    }
}

function main() {
    assertBetaSnapshotBranch(process.env.GITHUB_REF_NAME);
    const versionsBefore = readPackageVersions(repositoryRoot);

    try {
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
            console.log(
                `Publishing ${packageName}@${version} with dist-tag beta.`,
            );
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
    } finally {
        discardUncommittedSnapshotEdits(repositoryRoot);
    }
}

if (
    process.argv[1] &&
    path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
    main();
}
