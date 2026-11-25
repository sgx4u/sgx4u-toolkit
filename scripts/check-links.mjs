import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");

const dependencyFieldNames = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
];

const skippedDirectoryNames = new Set([
    "node_modules",
    "dist",
    ".git",
    ".turbo",
    "coverage",
]);

/**
 * @param {string} specifier
 * @param {string} packageDirectory
 * @param {string} rootDirectory
 */
export function linkSpecifierEscapesRepository(
    specifier,
    packageDirectory,
    rootDirectory,
) {
    if (!specifier.startsWith("link:") && !specifier.startsWith("file:")) {
        return false;
    }
    if (specifier.startsWith("link:")) {
        const target = specifier.slice("link:".length);
        const resolvedTarget = path.resolve(packageDirectory, target);
        return !isInsideRepository(resolvedTarget, rootDirectory);
    }
    const target = specifier.slice("file:".length);
    const resolvedTarget = path.resolve(packageDirectory, target);
    return !isInsideRepository(resolvedTarget, rootDirectory);
}

/**
 * @param {string} candidate
 * @param {string} rootDirectory
 */
function isInsideRepository(candidate, rootDirectory) {
    const relativePath = path.relative(rootDirectory, candidate);
    return (
        relativePath === "" ||
        (!relativePath.startsWith("..") && !path.isAbsolute(relativePath))
    );
}

/**
 * @param {string} rootDirectory
 * @returns {{ relativePath: string, dependencyName: string, specifier: string }[]}
 */
export function findEscapingLinks(rootDirectory) {
    /** @type {{ relativePath: string, dependencyName: string, specifier: string }[]} */
    const findings = [];

    /**
     * @param {string} directory
     */
    function walk(directory) {
        for (const entry of readdirSync(directory, { withFileTypes: true })) {
            if (skippedDirectoryNames.has(entry.name)) {
                continue;
            }
            const absolutePath = path.join(directory, entry.name);
            if (entry.isDirectory()) {
                walk(absolutePath);
                continue;
            }
            if (
                entry.name !== "package.json" &&
                entry.name !== "pnpm-workspace.yaml"
            ) {
                continue;
            }
            const relativePath = path.relative(rootDirectory, absolutePath);
            const contents = readFileSync(absolutePath, "utf8");
            if (entry.name === "package.json") {
                const packageManifest = JSON.parse(contents);
                for (const fieldName of dependencyFieldNames) {
                    const dependencies = packageManifest[fieldName];
                    if (!dependencies || typeof dependencies !== "object") {
                        continue;
                    }
                    for (const [dependencyName, specifier] of Object.entries(
                        dependencies,
                    )) {
                        if (typeof specifier !== "string") {
                            continue;
                        }
                        if (
                            linkSpecifierEscapesRepository(
                                specifier,
                                path.dirname(absolutePath),
                                rootDirectory,
                            )
                        ) {
                            findings.push({
                                relativePath,
                                dependencyName,
                                specifier,
                            });
                        }
                    }
                }
                continue;
            }
            const specifierExpression = /(?:link|file):[^\s"'`,]+/g;
            for (const match of contents.matchAll(specifierExpression)) {
                const specifier = match[0];
                if (
                    linkSpecifierEscapesRepository(
                        specifier,
                        rootDirectory,
                        rootDirectory,
                    )
                ) {
                    findings.push({
                        relativePath,
                        dependencyName: "(workspace file)",
                        specifier,
                    });
                }
            }
        }
    }

    if (statSync(rootDirectory).isDirectory()) {
        walk(rootDirectory);
    }
    return findings;
}

function main() {
    const findings = findEscapingLinks(repositoryRoot);
    if (findings.length === 0) {
        return;
    }
    for (const finding of findings) {
        console.error(
            `${finding.relativePath} ${finding.dependencyName} uses ${finding.specifier}, which points outside the repository. Commit workspace: ranges instead of local links.`,
        );
    }
    process.exitCode = 1;
}

if (
    process.argv[1] &&
    path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
    main();
}
