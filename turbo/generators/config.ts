import {
    appendFileSync,
    existsSync,
    mkdirSync,
    readFileSync,
    writeFileSync,
} from "node:fs";
import path from "node:path";
import type { PlopTypes } from "@turbo/gen";

type RuntimeName = "universal" | "edge" | "node";

interface PackagePromptAnswers {
    packageName: string;
    packageKind: "config" | "regular";
    runtimeName: RuntimeName;
    ownerHandle: string;
    packageDirectory: string;
}

interface PackageAnswers extends PackagePromptAnswers {
    tsconfigPreset: string;
}

const reservedPackageNames = new Set(["utils", "common", "shared"]);

function assertPackageName(value: string): true | string {
    if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(value)) {
        return "Use lowercase kebab-case, starting with a letter.";
    }
    if (value === "config") {
        return "config is the tooling folder. Name the preset itself, such as eslint-config.";
    }
    if (value === "toolkit") {
        return "toolkit is the workspace package @sgx4u/toolkit. It has no version and is not published.";
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

function isPackagePromptAnswers(value: object): value is PackagePromptAnswers {
    const candidate = value as Record<string, unknown>;
    return (
        typeof candidate.packageName === "string" &&
        (candidate.packageKind === "config" ||
            candidate.packageKind === "regular") &&
        (candidate.runtimeName === "universal" ||
            candidate.runtimeName === "edge" ||
            candidate.runtimeName === "node") &&
        typeof candidate.ownerHandle === "string" &&
        typeof candidate.packageDirectory === "string"
    );
}

function tsconfigPresetForRuntime(runtimeName: RuntimeName): string {
    if (runtimeName === "node") {
        return "@sgx4u/tsconfig/node.json";
    }
    if (runtimeName === "edge") {
        return "@sgx4u/tsconfig/edge.json";
    }

    return "@sgx4u/tsconfig/library.json";
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
        candidate.runtimeName = "node";
        candidate.packageDirectory = `packages/config/${candidate.packageName}`;
    } else if (candidate.packageKind === "regular") {
        candidate.packageDirectory = `packages/${candidate.packageName}`;
    }
    if (!isPackagePromptAnswers(candidate)) {
        throw new Error("Package generator answers were incomplete.");
    }
    if (
        candidate.packageKind === "config" &&
        candidate.runtimeName !== "node"
    ) {
        throw new Error("Config packages use the node runtime.");
    }

    const packageAnswers: PackageAnswers = {
        ...candidate,
        tsconfigPreset: tsconfigPresetForRuntime(candidate.runtimeName),
    };
    // Plop renders templates from the original answers object. Copy the
    // derived fields back onto it so the templates can see them.
    Object.assign(value, packageAnswers);
    return packageAnswers;
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
                name: "runtimeName",
                message: "Runtime",
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
                if (packageAnswers.packageKind === "config") {
                    return "Config presets stay in the repository and do not get a changeset.";
                }
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
