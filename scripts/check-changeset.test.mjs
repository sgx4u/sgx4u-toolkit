import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
    mkdirSync,
    mkdtempSync,
    readFileSync,
    readdirSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
    contractFieldChanges,
    evaluateChangesetRequirement,
    hasNoChangesetLabel,
    isWorkspaceToolingPath,
    userVisibleChangeReason,
} from "./check-changeset.mjs";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));

const libraryManifest = {
    name: "@sgx4u/example",
    version: "0.0.0",
    files: ["dist", "src", "!src/**/*.test.ts", "README.md"],
    exports: { ".": "./dist/index.js" },
};

test("docs, tests, and dev-only manifest edits are not release notes", () => {
    assert.equal(
        userVisibleChangeReason("README.md", libraryManifest, libraryManifest),
        null,
    );
    assert.equal(
        userVisibleChangeReason(
            "src/is-blank/is-blank.test.ts",
            libraryManifest,
            libraryManifest,
        ),
        null,
    );
    assert.equal(
        userVisibleChangeReason(
            "tsconfig.json",
            libraryManifest,
            libraryManifest,
        ),
        null,
    );
    assert.equal(
        userVisibleChangeReason(
            "src/is-blank/is-blank.ts",
            libraryManifest,
            libraryManifest,
        ),
        "source",
    );
    assert.equal(
        userVisibleChangeReason(
            "package.json",
            { ...libraryManifest, devDependencies: { eslint: "1.0.0" } },
            { ...libraryManifest, devDependencies: { eslint: "2.0.0" } },
        ),
        null,
    );
    assert.equal(
        userVisibleChangeReason("package.json", libraryManifest, {
            ...libraryManifest,
            engines: { node: ">=24" },
        }),
        "package.json engines",
    );
    assert.deepEqual(
        contractFieldChanges(
            { scripts: { test: "vitest" } },
            { scripts: { test: "node --test" } },
        ),
        [],
    );
    assert.equal(isWorkspaceToolingPath("packages/config/eslint-config"), true);
    assert.equal(isWorkspaceToolingPath("packages/example"), false);
    assert.equal(hasNoChangesetLabel("docs, no-changeset"), true);
    assert.equal(hasNoChangesetLabel("documentation"), false);
});

test("a published source change needs a changeset and a tooling change does not", () => {
    const rootDirectory = createRepository();
    writeLibrary(rootDirectory);
    writeTooling(rootDirectory);
    commitAll(rootDirectory, "chore: initial packages");

    writeFileSync(
        path.join(rootDirectory, "packages", "example", "README.md"),
        "# docs\n",
    );
    let result = evaluateChangesetRequirement(rootDirectory, "main", "");
    assert.equal(result.accepted, true, result.problems.join("\n"));

    writeFileSync(
        path.join(rootDirectory, "packages", "example", "src", "index.ts"),
        'export const formatLabel = () => "label";\n',
    );
    result = evaluateChangesetRequirement(rootDirectory, "main", "");
    assert.equal(result.accepted, false);
    assert.match(result.problems.join("\n"), /@sgx4u\/example/);

    result = evaluateChangesetRequirement(
        rootDirectory,
        "main",
        "no-changeset",
    );
    assert.equal(result.accepted, true, result.problems.join("\n"));

    writeChangeset(rootDirectory, "example-label.md", [
        "---",
        '"@sgx4u/example": patch',
        "---",
        "",
        "Fixed: `formatLabel` returns the label callers display.",
        "",
    ]);
    result = evaluateChangesetRequirement(rootDirectory, "main", "");
    assert.equal(result.accepted, true, result.problems.join("\n"));

    writeFileSync(
        path.join(
            rootDirectory,
            "packages",
            "config",
            "eslint-config",
            "index.js",
        ),
        "export const definePackageConfig = () => [];\n",
    );
    result = evaluateChangesetRequirement(rootDirectory, "main", "");
    assert.equal(result.accepted, true, result.problems.join("\n"));
});

test("a changeset for workspace tooling is rejected", () => {
    const rootDirectory = createRepository();
    writeLibrary(rootDirectory);
    writeTooling(rootDirectory);
    writeChangeset(rootDirectory, "tooling.md", [
        "---",
        '"@sgx4u/eslint-config": patch',
        "---",
        "",
        "Fixed: `definePackageConfig` returns a flat config.",
        "",
    ]);
    commitAll(rootDirectory, "chore: add a tooling note");
    const result = evaluateChangesetRequirement(rootDirectory, "main", "");
    assert.equal(result.accepted, false);
    assert.match(result.problems.join("\n"), /not published/);
});

test("workspace tooling packages stay private", () => {
    const configDirectory = path.join(repositoryRoot, "packages", "config");
    for (const entry of readdirSync(configDirectory, { withFileTypes: true })) {
        if (!entry.isDirectory()) {
            continue;
        }
        const packageManifest = JSON.parse(
            readFileSync(
                path.join(configDirectory, entry.name, "package.json"),
                "utf8",
            ),
        );
        assert.equal(packageManifest.private, true, entry.name);
        assert.equal(packageManifest.publishConfig, undefined, entry.name);
    }
});

/**
 * @param {string} [prefix]
 */
function createRepository(prefix = "sgx4u-changeset-") {
    const rootDirectory = mkdtempSync(path.join(tmpdir(), prefix));
    runGit(rootDirectory, ["init", "-b", "main"]);
    runGit(rootDirectory, ["config", "user.email", "test@example.com"]);
    runGit(rootDirectory, ["config", "user.name", "Changeset Test"]);
    return rootDirectory;
}

/**
 * @param {string} rootDirectory
 */
function writeLibrary(rootDirectory) {
    const packageDirectory = path.join(rootDirectory, "packages", "example");
    mkdirSync(path.join(packageDirectory, "src"), { recursive: true });
    writeFileSync(
        path.join(packageDirectory, "package.json"),
        `${JSON.stringify(
            {
                name: "@sgx4u/example",
                version: "0.0.0",
                files: ["dist", "src", "README.md"],
            },
            null,
            4,
        )}\n`,
    );
    writeFileSync(
        path.join(packageDirectory, "src", "index.ts"),
        'export const formatLabel = () => "old";\n',
    );
    writeFileSync(path.join(packageDirectory, "README.md"), "# example\n");
}

/**
 * @param {string} rootDirectory
 */
function writeTooling(rootDirectory) {
    const packageDirectory = path.join(
        rootDirectory,
        "packages",
        "config",
        "eslint-config",
    );
    mkdirSync(packageDirectory, { recursive: true });
    writeFileSync(
        path.join(packageDirectory, "package.json"),
        `${JSON.stringify(
            {
                name: "@sgx4u/eslint-config",
                private: true,
                version: "0.0.0",
                files: ["index.js"],
            },
            null,
            4,
        )}\n`,
    );
    writeFileSync(
        path.join(packageDirectory, "index.js"),
        "export const definePackageConfig = () => [];\n",
    );
}

/**
 * @param {string} rootDirectory
 * @param {string} fileName
 * @param {string[]} lines
 */
function writeChangeset(rootDirectory, fileName, lines) {
    const directory = path.join(rootDirectory, ".changeset");
    mkdirSync(directory, { recursive: true });
    writeFileSync(path.join(directory, fileName), lines.join("\n"));
}

/**
 * @param {string} rootDirectory
 * @param {string} message
 */
function commitAll(rootDirectory, message) {
    runGit(rootDirectory, ["add", "."]);
    runGit(rootDirectory, ["commit", "-m", message]);
}

/**
 * @param {string} rootDirectory
 * @param {string[]} gitArguments
 */
function runGit(rootDirectory, gitArguments) {
    const result = spawnSync("git", gitArguments, {
        cwd: rootDirectory,
        encoding: "utf8",
    });
    assert.equal(
        result.status,
        0,
        `${gitArguments.join(" ")}\n${result.stderr}`,
    );
}
