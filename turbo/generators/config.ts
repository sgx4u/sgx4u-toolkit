/**
 * Plop generator for a new `@sgx4u` package.
 *
 * Run it with `pnpm exec turbo gen package`. Turbo loads this file as the
 * root generator. The prompts ask for a kebab-case name, a package kind, a
 * runtime for a published library, and a GitHub handle.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { PlopTypes } from "@turbo/gen";

/** Runtime a generated package lints and typechecks as. */
type RuntimeName = "universal" | "edge" | "node";

/**
 * Answers collected from the prompts, before derived fields are added.
 *
 * A config preset forces `runtimeName` to `"node"` and sets
 * `packageDirectory` to `packages/config/<name>`. A regular package sets
 * `packageDirectory` to `packages/<name>` and keeps the chosen runtime.
 */
interface PackagePromptAnswers {
    /** Kebab-case name, without the `@sgx4u/` scope. */
    packageName: string;
    /** `"config"` for a private preset, `"regular"` for a published library. */
    packageKind: "config" | "regular";
    /** Runtime written into the ESLint config and the boundary tag. */
    runtimeName: RuntimeName;
    /** GitHub handle without `@`, used in the README owner line. */
    ownerHandle: string;
    /** Repository-relative directory the templates are written to. */
    packageDirectory: string;
}

/**
 * Prompt answers plus the JSON `extends` text the tsconfig template inserts.
 */
interface PackageAnswers extends PackagePromptAnswers {
    /**
     * JSON text for `tsconfig.json` `extends`. A string literal for one
     * preset, or a JSON array when a library extends two presets.
     */
    tsconfigExtends: string;
}

// Catch-all names hide the one job a package does, so the prompt rejects them.
const reservedPackageNames = new Set(["utils", "common", "shared"]);

/**
 * Prompt validator for the package name.
 *
 * @param value - Text the user typed, without the `@sgx4u/` scope.
 * @returns `true` when the name can be used, or a message Plop shows.
 */
function assertPackageName(value: string): true | string {
    if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(value)) {
        return "Use lowercase kebab-case, starting with a letter.";
    }
    if (value === "config") {
        return "config is the tooling folder. Name the preset itself, such as eslint-config.";
    }
    if (value === "toolkit") {
        return "toolkit is the workspace package @sgx4u/toolkit. It is private and is not published.";
    }
    if (reservedPackageNames.has(value)) {
        return "utils, common, and shared are not package names. Name the one job the package does.";
    }

    return true;
}

/**
 * Whether the runtime prompt should be shown.
 *
 * A config preset always uses Node, so that prompt is skipped and the
 * runtime is filled in later.
 *
 * @param answers - Partial prompt answers. Plop may pass an incomplete object.
 * @returns `true` when the package kind is `"regular"`.
 */
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

/**
 * JSON text for a generated package's `tsconfig.json` `extends` field.
 *
 * The template inserts the return value raw, so this is already a JSON
 * string or a JSON array, not a JavaScript value. Call it when rendering
 * `tsconfig.json.hbs`, or from a test that checks that render.
 *
 * A config preset extends `@sgx4u/tsconfig/node.json` only. A universal
 * library extends `@sgx4u/tsconfig/library.json` only: it adds no runtime
 * `lib` or `types` beyond the baseline that preset extends. An edge or Node
 * library extends `library.json` and then the runtime preset, so declaration
 * settings and the runtime `lib` or `types` both apply. `runtimeName` is
 * ignored for a config preset.
 *
 * @param packageKind - `"config"` for a private preset, `"regular"` for a published library.
 * @param runtimeName - `"universal"`, `"edge"`, or `"node"`.
 * @returns A JSON string literal, or a JSON array of two string literals.
 * @example
 * tsconfigExtendsFor("regular", "edge")
 */
export function tsconfigExtendsFor(
    packageKind: PackagePromptAnswers["packageKind"],
    runtimeName: RuntimeName,
): string {
    if (packageKind === "config") {
        return JSON.stringify("@sgx4u/tsconfig/node.json");
    }
    if (runtimeName === "universal") {
        return JSON.stringify("@sgx4u/tsconfig/library.json");
    }

    return `[${JSON.stringify("@sgx4u/tsconfig/library.json")}, ${JSON.stringify(`@sgx4u/tsconfig/${runtimeName}.json`)}]`;
}

/**
 * Fills derived answers and copies them back onto the object Plop renders.
 *
 * @param value - The answers object Plop passes to an action. It is mutated.
 * @returns The completed answers, including `tsconfigExtends`.
 * @throws {Error} When a required answer is missing, or a config preset is not on the Node runtime.
 */
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
        tsconfigExtends: tsconfigExtendsFor(
            candidate.packageKind,
            candidate.runtimeName,
        ),
    };
    // Plop renders templates from the original answers object. Copy the
    // derived fields back onto it so the templates can see them.
    Object.assign(value, packageAnswers);
    return packageAnswers;
}

/**
 * Repository root the generator writes into.
 *
 * @returns The current working directory. Turbo runs a root generator there.
 */
function repositoryRoot(): string {
    return process.cwd();
}

/**
 * Registers the `package` generator on the Plop instance Turbo provides.
 *
 * A config preset is written under `packages/config/<name>`, forced to the
 * Node runtime, and left private with no changeset. A regular package is
 * written under `packages/<name>` and receives
 * `.changeset/<name>-initial.md` with a minor bump. The directory action
 * runs before any file is written.
 *
 * @param plop - The Plop API Turbo passes to a generator module.
 * @returns Nothing. The generator is registered on `plop`.
 * @throws {Error} The directory action throws when that folder already exists. The changeset action throws when `<name>-initial.md` already exists, or when the prompt answers are incomplete.
 * @example
 * // pnpm exec turbo gen package
 */
export default function generator(plop: PlopTypes.NodePlopAPI): void {
    // Templates branch on packageKind and runtimeName with `{{#if (eq ...)}}`.
    plop.setHelper("eq", (left: unknown, right: unknown) => left === right);

    plop.setGenerator("package", {
        description:
            "Create an @sgx4u package under packages/ or private tooling under packages/config",
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
                        name: "Config package (packages/config/<name>, private, not published)",
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
                    return "Config packages are private workspace tooling. They stay in the repository and do not get a changeset.";
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
                        `Summary: First release of ${packageName}.`,
                        "",
                        `Added: \`packageIdentifier\` returns \`${packageName}\`.`,
                        "",
                    ].join("\n"),
                );
                return `Added ${path.relative(repositoryRoot(), changesetPath)}`;
            },
        ],
    });
}
