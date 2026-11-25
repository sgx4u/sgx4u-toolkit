import {
    appendFileSync,
    existsSync,
    mkdirSync,
    readFileSync,
    writeFileSync,
} from "node:fs";
import path from "node:path";
import type { PlopTypes } from "@turbo/gen";

interface PackageAnswers {
    packageName: string;
    packageKind: "config" | "regular";
    tierName: "platform" | "foundation" | "capability" | "adapter";
    runtimeName: "universal" | "edge" | "node";
    ownerHandle: string;
    packageDirectory: string;
}

const reservedPackageNames = new Set(["utils", "common", "shared"]);

function assertPackageName(value: string): true | string {
    if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(value)) {
        return "Use lowercase kebab-case, starting with a letter.";
    }
    if (value === "config") {
        return "config is the tooling folder. Name the preset itself, such as eslint-config.";
    }
    if (reservedPackageNames.has(value)) {
        return "utils, common, and shared are not package names. Name the one job the package does.";
    }
    return true;
}

function isRegularPackage(answers: unknown): boolean {
    return (
        typeof answers === "object" &&
        answers !== null &&
        (answers as { packageKind?: unknown }).packageKind === "regular"
    );
}

function isPackageAnswers(value: object): value is PackageAnswers {
    const candidate = value as Record<string, unknown>;
    return (
        typeof candidate.packageName === "string" &&
        (candidate.packageKind === "config" ||
            candidate.packageKind === "regular") &&
        (candidate.tierName === "platform" ||
            candidate.tierName === "foundation" ||
            candidate.tierName === "capability" ||
            candidate.tierName === "adapter") &&
        (candidate.runtimeName === "universal" ||
            candidate.runtimeName === "edge" ||
            candidate.runtimeName === "node") &&
        typeof candidate.ownerHandle === "string" &&
        typeof candidate.packageDirectory === "string"
    );
}

function preparePackageAnswers(value: unknown): PackageAnswers {
    if (typeof value !== "object" || value === null) {
        throw new Error("Package generator answers were incomplete.");
    }
    const candidate = value as Record<string, unknown>;
    if (typeof candidate.packageName !== "string") {
        throw new Error("Package generator answers were incomplete.");
    }
    if (candidate.packageKind === "config") {
        candidate.tierName = "platform";
        candidate.runtimeName = "node";
        candidate.packageDirectory = `packages/config/${candidate.packageName}`;
    } else if (candidate.packageKind === "regular") {
        candidate.packageDirectory = `packages/${candidate.packageName}`;
    }
    if (!isPackageAnswers(candidate)) {
        throw new Error("Package generator answers were incomplete.");
    }
    if (
        candidate.packageKind === "config" &&
        (candidate.tierName !== "platform" || candidate.runtimeName !== "node")
    ) {
        throw new Error("Config packages use tier platform and runtime node.");
    }
    if (
        candidate.packageKind === "regular" &&
        candidate.tierName === "platform"
    ) {
        throw new Error(
            "Tier platform belongs in packages/config. Choose the config package kind.",
        );
    }
    if (
        (candidate.tierName === "foundation" ||
            candidate.tierName === "capability") &&
        candidate.runtimeName !== "universal"
    ) {
        throw new Error(
            "Foundation and capability packages are platform-free. Use runtime universal.",
        );
    }
    if (
        candidate.tierName === "adapter" &&
        candidate.runtimeName !== "edge" &&
        candidate.runtimeName !== "node"
    ) {
        throw new Error("Adapter packages use runtime edge or node.");
    }
    return candidate;
}

function repositoryRoot(): string {
    // turbo gen runs a root generator with the repository as the working directory.
    return process.cwd();
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
    plop.setHelper("eq", (left: unknown, right: unknown) => left === right);

    plop.setGenerator("package", {
        description:
            "Create a public @sgx4u package under packages/ or packages/config",
        prompts: [
            {
                type: "input",
                name: "packageName",
                message: "Package name (kebab-case, without the @sgx4u scope)",
                validate: assertPackageName,
            },
            {
                type: "list",
                name: "packageKind",
                message: "Package kind",
                choices: [
                    {
                        name: "Config package (packages/config/<name>)",
                        value: "config",
                    },
                    {
                        name: "Regular package (packages/<name>)",
                        value: "regular",
                    },
                ],
            },
            {
                type: "list",
                name: "tierName",
                message: "Tier",
                when: isRegularPackage,
                choices: ["foundation", "capability", "adapter"],
            },
            {
                type: "list",
                name: "runtimeName",
                message: "Runtime (web and native belong in sgx4u-ui)",
                when: isRegularPackage,
                choices: ["universal", "edge", "node"],
            },
            {
                type: "input",
                name: "ownerHandle",
                message: "GitHub owner handle, without @",
                default: "sgx4u",
                validate: (value: string) =>
                    /^[A-Za-z0-9-]+$/.test(value) ||
                    "Use a GitHub handle without @.",
            },
        ],
        actions: [
            (answers: unknown) => {
                const packageAnswers = preparePackageAnswers(answers);
                const destination = path.join(
                    repositoryRoot(),
                    packageAnswers.packageDirectory,
                );
                if (existsSync(destination)) {
                    throw new Error(
                        `Package directory already exists: ${destination}`,
                    );
                }
                return "Package directory is available";
            },
            {
                type: "addMany",
                destination: "{{ turbo.paths.root }}/{{ packageDirectory }}",
                base: "templates/package",
                templateFiles: "templates/package/**",
                globOptions: { dot: true },
            },
            (answers: unknown) => {
                const packageAnswers = preparePackageAnswers(answers);
                const changesetDirectory = path.join(
                    repositoryRoot(),
                    ".changeset",
                );
                mkdirSync(changesetDirectory, { recursive: true });
                const changesetPath = path.join(
                    changesetDirectory,
                    `${packageAnswers.packageName}-initial.md`,
                );
                if (existsSync(changesetPath)) {
                    throw new Error(
                        `Changeset already exists: ${changesetPath}`,
                    );
                }
                const packageName = `@sgx4u/${packageAnswers.packageName}`;
                writeFileSync(
                    changesetPath,
                    [
                        "---",
                        `"${packageName}": minor`,
                        "---",
                        "",
                        `Add ${packageName}.`,
                        "",
                        "The package starts at 0.0.0. This changeset releases 0.1.0.",
                        "Publish 0.1.0 once from a laptop so an npm trusted publisher can be attached.",
                        "Later versions are published by .github/workflows/release.yml.",
                        "",
                    ].join("\n"),
                );
                return `Added ${path.relative(repositoryRoot(), changesetPath)}`;
            },
            (answers: unknown) => {
                const packageAnswers = preparePackageAnswers(answers);
                const owner = `@${packageAnswers.ownerHandle.replace(/^@/, "")}`;
                const codeownersPath = path.join(
                    repositoryRoot(),
                    ".github",
                    "CODEOWNERS",
                );
                const entry = `/${packageAnswers.packageDirectory}/ ${owner}`;
                const current = existsSync(codeownersPath)
                    ? readFileSync(codeownersPath, "utf8")
                    : "";
                if (!current.includes(entry)) {
                    appendFileSync(
                        codeownersPath,
                        `${current.endsWith("\n") || current.length === 0 ? "" : "\n"}${entry}\n`,
                    );
                }
                return `Recorded ${entry}`;
            },
        ],
    });
}
