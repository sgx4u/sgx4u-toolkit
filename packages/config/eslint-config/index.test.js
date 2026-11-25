import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ESLint } from "eslint";
import { definePackageConfig, defineRootConfig } from "./index.js";

const packageDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(packageDirectory, "../../..");

/**
 * @param {"universal" | "edge" | "node"} runtime
 */
function configForRuntime(runtime) {
    return definePackageConfig({
        runtime,
        rootDir: packageDirectory,
    });
}

/**
 * @param {"universal" | "edge" | "node"} runtime
 * @param {string} sourceText
 */
async function restrictedImportMessages(runtime, sourceText) {
    const eslint = new ESLint({
        cwd: packageDirectory,
        overrideConfigFile: true,
        overrideConfig: configForRuntime(runtime),
    });
    const results = await eslint.lintText(sourceText, {
        filePath: path.join(packageDirectory, "src/runtime-probe.ts"),
    });

    return results
        .flatMap((result) => result.messages)
        .filter(
            (message) =>
                message.ruleId === "no-restricted-imports" ||
                message.ruleId === "no-restricted-syntax",
        );
}

test("universal rejects Node built-ins, including subpaths", async () => {
    for (const specifier of [
        "node:fs",
        "node:fs/promises",
        "fs",
        "fs/promises",
        "buffer",
        "node:child_process",
    ]) {
        const messages = await restrictedImportMessages(
            "universal",
            `import "${specifier}";\n`,
        );
        assert.equal(
            messages.length,
            1,
            `${specifier} should be rejected for universal`,
        );
    }
});

test("edge allows implemented nodejs_compat modules", async () => {
    for (const specifier of [
        "node:fs",
        "node:fs/promises",
        "node:path",
        "node:buffer",
        "node:http",
        "node:net",
        "node:dns",
        "node:tls",
        "node:crypto",
    ]) {
        const messages = await restrictedImportMessages(
            "edge",
            `import "${specifier}";\n`,
        );
        assert.equal(
            messages.length,
            0,
            `${specifier} should be allowed for edge`,
        );
    }
});

test("edge rejects non-functional Workers stub modules", async () => {
    for (const specifier of [
        "node:child_process",
        "child_process",
        "node:vm",
        "node:worker_threads",
        "node:http2",
        "node:inspector/promises",
        "node:_stream_wrap",
    ]) {
        const messages = await restrictedImportMessages(
            "edge",
            `import "${specifier}";\n`,
        );
        assert.equal(
            messages.length,
            1,
            `${specifier} should be rejected for edge`,
        );
    }
});

test("node allows Node built-ins", async () => {
    for (const specifier of ["node:fs", "node:child_process", "node:vm"]) {
        const messages = await restrictedImportMessages(
            "node",
            `import "${specifier}";\n`,
        );
        assert.equal(
            messages.length,
            0,
            `${specifier} should be allowed for node`,
        );
    }
});

test("every runtime rejects the private scope", async () => {
    for (const runtime of ["universal", "edge", "node"]) {
        const messages = await restrictedImportMessages(
            runtime,
            'import "@sgx4u-private/example";\n',
        );
        assert.equal(
            messages.length,
            1,
            `${runtime} should reject the private scope`,
        );
    }
});

test("every runtime rejects deep imports", async () => {
    for (const specifier of [
        "@sgx4u/string/src/is-blank/is-blank.ts",
        "@sgx4u/string/dist/index.js",
    ]) {
        const messages = await restrictedImportMessages(
            "node",
            `import "${specifier}";\n`,
        );
        assert.equal(messages.length, 1, `${specifier} should be rejected`);
    }
});

test("universal rejects require, dynamic import, and import equals", async () => {
    for (const sourceText of [
        'require("node:fs");\n',
        'await import("node:fs/promises");\n',
        'import fileSystem from "node:fs";\n',
        'import fileSystem = require("node:fs");\n',
    ]) {
        const messages = await restrictedImportMessages(
            "universal",
            sourceText,
        );
        assert.equal(messages.length, 1, sourceText);
    }
});

test("an unknown runtime throws instead of using the Node rules", () => {
    assert.throws(
        () =>
            definePackageConfig({
                runtime: "web",
                rootDir: packageDirectory,
            }),
        (error) => {
            assert.ok(error instanceof TypeError);
            assert.match(
                error.message,
                /runtime must be "universal", "edge", or "node"\. Received "web"\./,
            );
            return true;
        },
    );
});

test("rootDir is required and must be absolute", () => {
    assert.throws(
        () => definePackageConfig({ runtime: "node" }),
        (error) => {
            assert.ok(error instanceof TypeError);
            assert.match(
                error.message,
                /rootDir must be an absolute path to the directory of the ESLint config file\. Pass import\.meta\.dirname\. Received undefined\./,
            );
            return true;
        },
    );
    assert.throws(
        () => definePackageConfig({ runtime: "node", rootDir: "packages" }),
        (error) => {
            assert.ok(error instanceof TypeError);
            assert.match(error.message, /Received "packages"\./);
            return true;
        },
    );
    assert.throws(
        () => defineRootConfig(),
        (error) => {
            assert.ok(error instanceof TypeError);
            assert.match(error.message, /Received undefined\./);
            return true;
        },
    );
    assert.throws(
        () => defineRootConfig({ rootDir: "relative" }),
        (error) => {
            assert.ok(error instanceof TypeError);
            assert.match(error.message, /Received "relative"\./);
            return true;
        },
    );
});

/**
 * @param {import("eslint").Linter.Config[]} configs
 * @param {string} rootDirectory
 */
function assertTsconfigRootDirectory(configs, rootDirectory) {
    const parserConfig = configs.find(
        (config) => config.languageOptions?.parser,
    );
    assert.ok(parserConfig);
    assert.equal(
        parserConfig.languageOptions.parserOptions.tsconfigRootDir,
        rootDirectory,
    );

    const lastConfig = configs.at(-1);
    assert.equal(lastConfig.files, undefined);
    assert.equal(
        lastConfig.languageOptions.parserOptions.tsconfigRootDir,
        rootDirectory,
    );

    for (const config of configs) {
        const parserOptions = config.languageOptions?.parserOptions;
        if (
            parserOptions == null ||
            (!Object.hasOwn(parserOptions, "project") &&
                !Object.hasOwn(parserOptions, "projectService"))
        ) {
            continue;
        }

        assert.equal(parserOptions.tsconfigRootDir, rootDirectory);
    }
}

test("tsconfigRootDir applies to every file, not one glob", () => {
    const packageConfigs = configForRuntime("node");
    const unrestrictedPackageConfig = packageConfigs.find(
        (config) =>
            config.files === undefined &&
            config.languageOptions?.parserOptions?.tsconfigRootDir ===
                packageDirectory,
    );
    assert.ok(unrestrictedPackageConfig);

    const rootConfigs = defineRootConfig({ rootDir: repositoryRoot });
    const unrestrictedRootConfig = rootConfigs.find(
        (config) =>
            config.files === undefined &&
            config.languageOptions?.parserOptions?.tsconfigRootDir ===
                repositoryRoot,
    );
    assert.ok(unrestrictedRootConfig);
    assert.ok(
        rootConfigs
            .flatMap((config) => config.ignores ?? [])
            .includes("packages/**"),
    );
});

test("the parser block and every typed block use rootDir", () => {
    assertTsconfigRootDirectory(
        configForRuntime("node"),
        path.resolve(packageDirectory),
    );
    assertTsconfigRootDirectory(
        defineRootConfig({ rootDir: repositoryRoot }),
        path.resolve(repositoryRoot),
    );
});

test("rootDir is normalized before it is copied to tsconfigRootDir", () => {
    const unnormalizedRootDirectory = `${packageDirectory}${path.sep}`;
    assert.notEqual(unnormalizedRootDirectory, packageDirectory);
    assertTsconfigRootDirectory(
        definePackageConfig({
            runtime: "node",
            rootDir: unnormalizedRootDirectory,
        }),
        packageDirectory,
    );
});

test("the parser block parses tsdown.config.ts after several configs were loaded", async () => {
    // Loading these configs records one candidate directory each: the
    // workspace root, eslint-config, and prettier-config. The base object
    // that sets the parser carries tsconfigRootDir, so parsing
    // tsdown.config.ts does not throw when more than one candidate exists.
    for (const configFile of [
        "eslint.config.js",
        "packages/config/eslint-config/eslint.config.js",
        "packages/config/prettier-config/eslint.config.js",
    ]) {
        await import(pathToFileURL(path.join(repositoryRoot, configFile)).href);
    }

    for (const [relativeDirectory, runtime] of [
        ["packages/string", "universal"],
        ["packages/config/eslint-config", "node"],
        ["packages/config/prettier-config", "node"],
        ["packages/config/tsdown-config", "node"],
        ["packages/config/vitest-config", "node"],
    ]) {
        const directory = path.join(repositoryRoot, relativeDirectory);
        const configs = definePackageConfig({
            runtime,
            rootDir: directory,
        });
        const parserConfig = configs.find(
            (config) => config.languageOptions?.parser,
        );
        const filePath = path.join(directory, "tsdown.config.ts");
        try {
            parserConfig.languageOptions.parser.parseForESLint(
                readFileSync(filePath, "utf8"),
                {
                    ...parserConfig.languageOptions.parserOptions,
                    filePath,
                    sourceType: "module",
                },
            );
        } catch (error) {
            assert.fail(`${filePath}\n${error.message}`);
        }
    }
});

test("the root config ignores package directories and package configs do not", () => {
    const rootIgnores = defineRootConfig({
        rootDir: repositoryRoot,
    }).flatMap((config) => config.ignores ?? []);
    assert.ok(rootIgnores.includes("packages/**"));

    const packageIgnores = configForRuntime("universal").flatMap(
        (config) => config.ignores ?? [],
    );
    assert.equal(packageIgnores.includes("packages/**"), false);
});

test("globals follow the runtime", () => {
    function globalsFor(runtime) {
        const configWithGlobals = configForRuntime(runtime).find(
            (config) => config.languageOptions?.globals,
        );
        return configWithGlobals.languageOptions.globals;
    }

    // The globals package uses false for a read-only global. undefined means
    // the name is not declared, so no-undef would report it.
    const universalGlobals = globalsFor("universal");
    assert.equal(universalGlobals.fetch, false);
    assert.equal(universalGlobals.process, undefined);
    assert.equal(universalGlobals.window, undefined);

    const edgeGlobals = globalsFor("edge");
    assert.equal(edgeGlobals.process, false);
    assert.equal(edgeGlobals.Buffer, false);
    assert.equal(edgeGlobals.window, undefined);

    const nodeGlobals = globalsFor("node");
    assert.equal(nodeGlobals.process, false);
    assert.equal(nodeGlobals.window, undefined);
});

const filesLintedAcrossConfigs = [
    "eslint.config.js",
    "commitlint.config.js",
    "scripts/check-links.mjs",
    "turbo/generators/config.ts",
    "packages/string/eslint.config.js",
    "packages/string/tsdown.config.ts",
    "packages/string/src/index.ts",
    "packages/string/src/is-blank/index.ts",
    "packages/string/src/is-blank/is-blank.ts",
    "packages/string/src/is-blank/is-blank.test.ts",
    "packages/string/src/collapse-whitespace/index.ts",
    "packages/string/src/collapse-whitespace/collapse-whitespace.ts",
    "packages/string/src/collapse-whitespace/collapse-whitespace.test.ts",
    "packages/config/eslint-config/eslint.config.js",
    "packages/config/eslint-config/index.js",
    "packages/config/eslint-config/index.test.js",
    "packages/config/eslint-config/tsdown.config.ts",
    "packages/config/prettier-config/eslint.config.js",
    "packages/config/prettier-config/index.js",
    "packages/config/prettier-config/index.test.js",
    "packages/config/prettier-config/tsdown.config.ts",
    "packages/config/tsdown-config/eslint.config.js",
    "packages/config/tsdown-config/src/index.ts",
    "packages/config/tsdown-config/src/define-library-config/index.ts",
    "packages/config/tsdown-config/src/define-library-config/define-library-config.ts",
    "packages/config/tsdown-config/src/define-library-config/define-library-config.test.ts",
    "packages/config/tsdown-config/tsdown.config.ts",
    "packages/config/vitest-config/eslint.config.js",
    "packages/config/vitest-config/src/index.ts",
    "packages/config/vitest-config/src/define-package-vitest-config/index.ts",
    "packages/config/vitest-config/src/define-package-vitest-config/define-package-vitest-config.ts",
    "packages/config/vitest-config/src/define-package-vitest-config/define-package-vitest-config.test.ts",
    "packages/config/vitest-config/tsdown.config.ts",
    "packages/config/tsconfig/eslint.config.js",
    "packages/config/tsconfig/index.test.js",
];

/**
 * @param {string} filePath
 */
function configDirectoryFor(filePath) {
    let directory = path.dirname(filePath);
    while (!existsSync(path.join(directory, "eslint.config.js"))) {
        const parentDirectory = path.dirname(directory);
        assert.notEqual(
            parentDirectory,
            directory,
            `no eslint.config.js above ${filePath}`,
        );
        directory = parentDirectory;
    }
    return directory;
}

/**
 * @param {import("eslint").ESLint.LintResult[]} results
 */
function parsingErrors(results) {
    return results.flatMap((result) =>
        result.messages
            .filter(
                (message) =>
                    message.fatal === true ||
                    message.message.includes("Parsing error") ||
                    message.message.includes("tsconfigRootDir"),
            )
            .map((message) => `${result.filePath}\n${message.message}`),
    );
}

test("several configs in one process parse every file with that config's rootDir", async () => {
    const absoluteFiles = filesLintedAcrossConfigs.map((relativeFile) =>
        path.join(repositoryRoot, relativeFile),
    );

    const rootEslint = new ESLint({ cwd: repositoryRoot });
    const rootResults = await rootEslint.lintFiles(absoluteFiles);
    assert.deepEqual(parsingErrors(rootResults), []);

    for (const filePath of absoluteFiles) {
        const calculatedConfig =
            await rootEslint.calculateConfigForFile(filePath);
        assert.equal(
            calculatedConfig.languageOptions?.parserOptions?.tsconfigRootDir,
            configDirectoryFor(filePath),
            filePath,
        );
    }

    const filesByDirectory = new Map();
    for (const filePath of absoluteFiles) {
        const directory = configDirectoryFor(filePath);
        const filesInDirectory = filesByDirectory.get(directory) ?? [];
        filesInDirectory.push(filePath);
        filesByDirectory.set(directory, filesInDirectory);
    }

    for (const [directory, filesInDirectory] of filesByDirectory) {
        const directoryEslint = new ESLint({
            cwd: directory,
            overrideConfigFile: path.join(directory, "eslint.config.js"),
        });
        const directoryResults =
            await directoryEslint.lintFiles(filesInDirectory);
        assert.deepEqual(parsingErrors(directoryResults), []);

        for (const filePath of filesInDirectory) {
            const calculatedConfig =
                await directoryEslint.calculateConfigForFile(filePath);
            assert.equal(
                calculatedConfig.languageOptions?.parserOptions
                    ?.tsconfigRootDir,
                directory,
                filePath,
            );
        }
    }
});
