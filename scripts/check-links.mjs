/**
 * Fails when a `link:` or `file:` dependency points outside this repository.
 *
 * `pnpm check` and the pre-commit hook run `node scripts/check-links.mjs`.
 * The scan reads every `package.json` and `pnpm-workspace.yaml`, skipping
 * vendor and generated directories. A specifier that resolves inside the
 * repository is allowed. Commit `workspace:` ranges for dependencies that
 * should be published.
 */

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

// Vendor and generated directories hold no committed dependency specifiers.
const skippedDirectoryNames = new Set([
    "node_modules",
    "dist",
    ".git",
    ".turbo",
    "coverage",
]);

/**
 * True when a dependency specifier is a `link:` or `file:` URL outside the repository.
 *
 * Other specifiers, including `workspace:` and registry ranges, return false.
 * The target is resolved from `packageDirectory`, then compared to
 * `rootDirectory`. A target that is the repository root itself stays inside.
 *
 * @param {string} specifier Dependency range from a manifest or workspace file.
 * @param {string} packageDirectory Directory the relative target is resolved from.
 * @param {string} rootDirectory Repository root the target must stay inside.
 * @returns {boolean}
 * @example
 * linkSpecifierEscapesRepository("link:../other-repo", "/repo/packages/example", "/repo")
 */
export function linkSpecifierEscapesRepository(
    specifier,
    packageDirectory,
    rootDirectory,
) {
    const protocol = specifier.startsWith("link:")
        ? "link:"
        : specifier.startsWith("file:")
          ? "file:"
          : "";
    if (protocol.length === 0) {
        return false;
    }

    const target = specifier.slice(protocol.length);
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
 * Every `link:` or `file:` dependency in the tree that resolves outside the repository.
 *
 * `package.json` dependency fields are read as JSON. `pnpm-workspace.yaml`
 * is scanned as text because the catalog is not a dependency map. A
 * workspace-file hit uses the dependency name `(workspace file)`.
 *
 * @param {string} rootDirectory Repository root to walk.
 * @returns {{ relativePath: string, dependencyName: string, specifier: string }[]} Empty when every local link stays inside the repository.
 * @throws {SyntaxError} When a `package.json` is not valid JSON.
 * @example
 * findEscapingLinks(repositoryRoot)
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
