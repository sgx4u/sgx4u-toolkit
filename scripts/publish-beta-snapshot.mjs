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
 * Allows a beta snapshot publish only from the beta branch or a local run.
 *
 * The snapshot job calls this with `GITHUB_REF_NAME` before it rewrites
 * versions. `develop` and `production` throw because a committed prerelease
 * on those branches would later ship as `latest`. An empty or missing branch
 * name is a local dry run: GitHub Actions sets `GITHUB_REF_NAME` on every
 * workflow run, so a job on the wrong branch still fails.
 *
 * @param {string | undefined} branchName `GITHUB_REF_NAME`, or unset for a local run.
 * @returns {void}
 * @throws {Error} When `branchName` is set and is not `beta`. The message names the branch.
 * @example
 * assertBetaSnapshotBranch("beta")
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
        // Presets under packages/config are private and are not snapshot-published.
        if (packageDirectoryName === "config") {
            continue;
        }
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
 * Published library names and the versions committed in their manifests.
 *
 * Only direct children of `packages/` are read. `packages/config` is skipped.
 * A private package, or a manifest with no string `name`, is skipped.
 *
 * @param {string} rootDirectory Repository root.
 * @returns {Map<string, string>} Package name to its `version` string. Empty when `packages/` is missing.
 * @example
 * readPackageVersions(repositoryRoot)
 */
export function readPackageVersions(rootDirectory) {
    /** @type {Map<string, string>} */
    const versions = new Map();
    const packagesDirectory = path.join(rootDirectory, "packages");
    collectPackageVersions(packagesDirectory, versions);
    return versions;
}

/**
 * Packages whose version string changed between two {@link readPackageVersions} maps.
 *
 * The snapshot job uses this to decide what to publish. A package that
 * exists only in `versionsBefore` is omitted, because a removed package has
 * nothing to publish. Order follows `versionsAfter`.
 *
 * @param {Map<string, string>} versionsBefore Versions before `changeset version --snapshot`.
 * @param {Map<string, string>} versionsAfter Versions after that command.
 * @returns {{ packageName: string, version: string }[]} The new version for each package that changed.
 * @example
 * packagesWithChangedVersions(versionsBefore, versionsAfter)
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
 * Deletes untracked `CHANGELOG.md` files Changesets created for the snapshot.
 *
 * Changesets writes that file when a library does not have one yet. The
 * snapshot must not leave it in the worktree. Only direct children of
 * `packages/` are libraries, so the scan stays one level deep. Tracked
 * changelogs are left in place, and every other untracked file is left alone.
 *
 * @param {string} rootDirectory
 */
function removeUntrackedChangelogs(rootDirectory) {
    const packagesDirectory = path.join(rootDirectory, "packages");
    if (
        !existsSync(packagesDirectory) ||
        !statSync(packagesDirectory).isDirectory()
    ) {
        return;
    }

    for (const entryName of readdirSync(packagesDirectory)) {
        const changelogPath = path.join(
            packagesDirectory,
            entryName,
            "CHANGELOG.md",
        );
        if (!existsSync(changelogPath) || !statSync(changelogPath).isFile()) {
            continue;
        }
        const relativePath = path.relative(rootDirectory, changelogPath);
        if (!isTracked(rootDirectory, relativePath)) {
            unlinkSync(changelogPath);
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
    if (versionsBefore.size === 0) {
        console.log(
            "No packages to publish. Nothing published to the beta tag.",
        );
        return;
    }

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
