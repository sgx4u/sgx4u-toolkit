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
    domainName: "platform" | "foundation" | "backend";
    tierName: "platform" | "foundation" | "capability" | "adapter";
    runtimeName: "universal" | "edge" | "node";
    ownerHandle: string;
}

const reservedPackageNames = new Set(["utils", "common", "shared"]);

function assertPackageName(value: string): true | string {
    if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(value)) {
        return "Use lowercase kebab-case, starting with a letter.";
    }
    if (reservedPackageNames.has(value)) {
        return "utils, common, and shared are not package names. Name the one job the package does.";
    }
    return true;
}

function isPackageAnswers(value: unknown): value is PackageAnswers {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const candidate = value as Record<string, unknown>;
    return (
        typeof candidate.packageName === "string" &&
        typeof candidate.domainName === "string" &&
        typeof candidate.tierName === "string" &&
        typeof candidate.runtimeName === "string" &&
        typeof candidate.ownerHandle === "string"
    );
}

function requirePackageAnswers(value: unknown): PackageAnswers {
    if (!isPackageAnswers(value)) {
        throw new Error("Package generator answers were incomplete.");
    }
    return value;
}

function repositoryRoot(): string {
    // turbo gen runs a root generator with the repository as the working directory.
    return process.cwd();
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
    plop.setHelper("eq", (left: unknown, right: unknown) => left === right);

    plop.setGenerator("package", {
        description:
            "Create a public @sgx4u package in platform, foundation, or backend",
        prompts: [
            {
                type: "input",
                name: "packageName",
                message: "Package name (kebab-case, without the @sgx4u scope)",
                validate: assertPackageName,
            },
            {
                type: "list",
                name: "domainName",
                message: "Domain folder",
                choices: ["platform", "foundation", "backend"],
            },
            {
                type: "list",
                name: "tierName",
                message: "Tier",
                choices: ["platform", "foundation", "capability", "adapter"],
            },
            {
                type: "list",
                name: "runtimeName",
                message: "Runtime (web and native belong in sgx4u-ui)",
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
                const packageAnswers = requirePackageAnswers(answers);
                if (
                    packageAnswers.domainName === "platform" &&
                    packageAnswers.tierName !== "platform"
                ) {
                    throw new Error(
                        "Packages in domains/platform use tier platform.",
                    );
                }
                if (
                    packageAnswers.tierName === "platform" &&
                    packageAnswers.domainName !== "platform"
                ) {
                    throw new Error(
                        "Tier platform only belongs in domains/platform.",
                    );
                }
                if (
                    (packageAnswers.tierName === "foundation" ||
                        packageAnswers.tierName === "capability") &&
                    packageAnswers.domainName !== "foundation"
                ) {
                    throw new Error(
                        "Foundation and capability packages belong in domains/foundation.",
                    );
                }
                if (
                    packageAnswers.tierName === "adapter" &&
                    packageAnswers.domainName !== "backend"
                ) {
                    throw new Error(
                        "Adapter packages belong in domains/backend.",
                    );
                }
                if (
                    (packageAnswers.tierName === "foundation" ||
                        packageAnswers.tierName === "capability") &&
                    packageAnswers.runtimeName !== "universal"
                ) {
                    throw new Error(
                        "Foundation and capability packages are platform-free. Use runtime universal.",
                    );
                }
                if (
                    packageAnswers.tierName === "adapter" &&
                    packageAnswers.runtimeName !== "edge" &&
                    packageAnswers.runtimeName !== "node"
                ) {
                    throw new Error(
                        "Adapter packages use runtime edge or node.",
                    );
                }
                if (
                    packageAnswers.tierName === "platform" &&
                    packageAnswers.runtimeName !== "node"
                ) {
                    throw new Error(
                        "Platform presets run on Node. Use runtime node.",
                    );
                }
                const destination = path.join(
                    repositoryRoot(),
                    "domains",
                    packageAnswers.domainName,
                    packageAnswers.packageName,
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
                destination:
                    "{{ turbo.paths.root }}/domains/{{ domainName }}/{{ packageName }}",
                base: "templates/package",
                templateFiles: "templates/package/**",
                globOptions: { dot: true },
            },
            (answers: unknown) => {
                const packageAnswers = requirePackageAnswers(answers);
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
                const packageAnswers = requirePackageAnswers(answers);
                const owner = `@${packageAnswers.ownerHandle.replace(/^@/, "")}`;
                const codeownersPath = path.join(
                    repositoryRoot(),
                    ".github",
                    "CODEOWNERS",
                );
                const entry = `/domains/${packageAnswers.domainName}/${packageAnswers.packageName}/ ${owner}`;
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
