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
 * Libraries live in packages/<name>. Presets live in packages/config and are not published.
 *
 * @param {string} relativeDirectory
 * @returns {boolean}
 */
export function isRealPackage(relativeDirectory) {
    const normalized = relativeDirectory.split(path.sep).join("/");
    const parts = normalized.split("/");
    return (
        parts.length === 2 && parts[0] === "packages" && parts[1] !== "config"
    );
}

/**
 * @param {string} packageName
 * @param {string} version
 * @returns {string}
 */
export function gitTagForPackage(packageName, version) {
    return `${packageName}@${version}`;
}

/**
 * @param {string} packageName
 * @param {string} distributionTag
 * @returns {string[]}
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
 * @param {string} rootDirectory
 * @returns {{ name: string, version: string, relativeDirectory: string }[]}
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
 * @param {string} packageName
 * @param {string} version
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
 * npm view exits 0 when that exact version is already on the registry.
 *
 * @param {{ status: number | null, stdout: string }} result
 * @param {string} version
 * @returns {boolean}
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
