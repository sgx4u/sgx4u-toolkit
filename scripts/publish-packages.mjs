/**
 * Publishes committed library versions for the release workflow.
 *
 * `release.yml` runs `node scripts/publish-packages.mjs` with
 * `GITHUB_REF_NAME` set. The dist-tag comes from `distributionTagForBranch`.
 * A version already on npm is skipped. After a successful publish, the
 * package name and version are appended to `CHANGESETS_OUTPUT` so Changesets
 * can push the git tag. Zero libraries is a successful run.
 */

import {
    appendFileSync,
    existsSync,
    readdirSync,
    readFileSync,
    statSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { distributionTagForBranch } from "./distribution-tag.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");

/**
 * True when `relativeDirectory` is a library folder, `packages/<name>`.
 *
 * Presets live in `packages/config/<name>` and are not published, so a path
 * with any other shape returns false. The name `config` is reserved for
 * that tooling folder.
 *
 * @param {string} relativeDirectory Repository-relative path. Separators may be `\` or `/`.
 * @returns {boolean}
 * @example
 * isRealPackage("packages/example")
 */
export function isRealPackage(relativeDirectory) {
    const normalized = relativeDirectory.split(path.sep).join("/");
    const parts = normalized.split("/");
    return (
        parts.length === 2 && parts[0] === "packages" && parts[1] !== "config"
    );
}

/**
 * Git tag Changesets records after a package is published.
 *
 * The shape is `<name>@<version>`, which is the tag `release.yml` pushes.
 *
 * @param {string} packageName Scoped package name.
 * @param {string} version Version that was published.
 * @returns {string}
 * @example
 * gitTagForPackage("@sgx4u/example", "0.1.0")
 */
export function gitTagForPackage(packageName, version) {
    return `${packageName}@${version}`;
}

/**
 * Arguments for `pnpm --filter <name> publish` of one library.
 *
 * `--access public` is required for a scoped package. `--no-git-checks`
 * lets the release job publish from the workflow checkout. The caller still
 * chooses the working directory and the environment, including the npm
 * trusted-publishing token.
 *
 * @param {string} packageName Package name passed to `--filter`.
 * @param {string} distributionTag npm dist-tag, `latest` or `previous`.
 * @returns {string[]}
 * @example
 * publishArguments("@sgx4u/example", "latest")
 */
export function publishArguments(packageName, distributionTag) {
    return [
        "--filter",
        packageName,
        "publish",
        "--tag",
        distributionTag,
        "--access",
        "public",
        "--no-git-checks",
    ];
}

/**
 * Libraries under `packages/<name>` that have a public name and version.
 *
 * Private packages, the `packages/config` directory, and a manifest missing
 * a string `name` or `version` are omitted. The result order follows the
 * directory listing.
 *
 * @param {string} rootDirectory Repository root.
 * @returns {{ name: string, version: string, relativeDirectory: string }[]} `relativeDirectory` uses `/`.
 * @example
 * listRealPackages(repositoryRoot)
 */
export function listRealPackages(rootDirectory) {
    const packagesDirectory = path.join(rootDirectory, "packages");
    /** @type {{ name: string, version: string, relativeDirectory: string }[]} */
    const packages = [];
    if (!existsSync(packagesDirectory)) {
        return packages;
    }
    for (const entry of readdirSync(packagesDirectory, {
        withFileTypes: true,
    })) {
        if (!entry.isDirectory()) {
            continue;
        }
        const relativeDirectory = path.posix.join("packages", entry.name);
        if (!isRealPackage(relativeDirectory)) {
            continue;
        }
        const manifestPath = path.join(
            packagesDirectory,
            entry.name,
            "package.json",
        );
        if (!statSync(manifestPath, { throwIfNoEntry: false })?.isFile()) {
            continue;
        }
        const packageManifest = JSON.parse(readFileSync(manifestPath, "utf8"));
        if (
            packageManifest.private === true ||
            typeof packageManifest.name !== "string" ||
            typeof packageManifest.version !== "string"
        ) {
            continue;
        }
        packages.push({
            name: packageManifest.name,
            version: packageManifest.version,
            relativeDirectory,
        });
    }
    return packages;
}

/**
 * Appends one git-tag record for Changesets after a publish succeeds.
 *
 * Changesets reads `CHANGESETS_OUTPUT` as newline-delimited JSON. When that
 * variable is unset, this returns without writing, which is how a local
 * invocation avoids touching a missing file.
 *
 * @param {string} packageName Package that was published.
 * @param {string} version Version that was published.
 * @returns {void}
 * @example
 * recordPublishedPackage("@sgx4u/example", "0.1.0")
 */
export function recordPublishedPackage(packageName, version) {
    const outputPath = process.env.CHANGESETS_OUTPUT;
    if (!outputPath) {
        return;
    }
    appendFileSync(
        outputPath,
        `${JSON.stringify({
            type: "git-tag",
            tag: gitTagForPackage(packageName, version),
            packageName,
        })}\n`,
    );
}

/**
 * True when `npm view` reported that the exact version is already published.
 *
 * A non-zero status means the version is absent or the registry could not
 * be read. Those two cases are not distinguished: the publish command then
 * runs, and a real registry failure fails that command. Stdout must equal
 * the version exactly, so a different version on the same line does not count.
 *
 * @param {{ status: number | null, stdout: string }} result Status and stdout from `npm view <name>@<version> version`.
 * @param {string} version Version that was queried.
 * @returns {boolean}
 * @example
 * registryHasVersion({ status: 0, stdout: "0.1.0\n" }, "0.1.0")
 */
export function registryHasVersion(result, version) {
    return result.status === 0 && result.stdout.trim() === version;
}

/**
 * @param {string} packageName
 * @param {string} version
 * @returns {boolean}
 */
function packageVersionIsOnRegistry(packageName, version) {
    const result = spawnSync(
        "npm",
        ["view", `${packageName}@${version}`, "version"],
        { encoding: "utf8" },
    );
    return registryHasVersion(
        { status: result.status, stdout: result.stdout ?? "" },
        version,
    );
}

function main() {
    const branchName = process.env.GITHUB_REF_NAME;
    if (!branchName) {
        console.error(
            "GITHUB_REF_NAME is required. This script is the release workflow publish command.",
        );
        process.exit(1);
    }

    const distributionTag = distributionTagForBranch(branchName);
    const packages = listRealPackages(repositoryRoot);
    if (packages.length === 0) {
        console.log("No library packages to publish.");
        return;
    }

    for (const packageInfo of packages) {
        if (packageVersionIsOnRegistry(packageInfo.name, packageInfo.version)) {
            console.log(
                `${packageInfo.name}@${packageInfo.version} is already on npm.`,
            );
            continue;
        }
        console.log(
            `Publishing ${packageInfo.name}@${packageInfo.version} with dist-tag ${distributionTag}.`,
        );
        const result = spawnSync(
            "pnpm",
            publishArguments(packageInfo.name, distributionTag),
            {
                cwd: repositoryRoot,
                stdio: "inherit",
                env: process.env,
            },
        );
        if ((result.status ?? 1) !== 0) {
            process.exit(result.status ?? 1);
        }
        recordPublishedPackage(packageInfo.name, packageInfo.version);
    }
}

if (
    process.argv[1] &&
    path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
    main();
}
