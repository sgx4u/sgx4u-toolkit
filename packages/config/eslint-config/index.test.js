import assert from "node:assert/strict";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import { definePackageConfig, defineRootConfig } from "./index.js";

const packageDirectory = path.dirname(fileURLToPath(import.meta.url));

/**
 * @param {"universal" | "edge" | "node"} runtime
 * @param {string} sourceText
 */
async function restrictedImportMessages(runtime, sourceText) {
    const eslint = new ESLint({
        cwd: packageDirectory,
        overrideConfigFile: true,
        overrideConfig: definePackageConfig({ runtime }),
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
        "@sgx4u/string/src/is-blank",
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
        () => definePackageConfig({ runtime: "web" }),
        /runtime must be "universal", "edge", or "node"/,
    );
});

test("the root config ignores package directories and package configs do not", () => {
    const rootIgnores = defineRootConfig().flatMap(
        (config) => config.ignores ?? [],
    );
    assert.ok(rootIgnores.includes("packages/**"));

    const packageIgnores = definePackageConfig({
        runtime: "universal",
    }).flatMap((config) => config.ignores ?? []);
    assert.equal(packageIgnores.includes("packages/**"), false);
});

test("globals follow the runtime", () => {
    function globalsFor(runtime) {
        const configWithGlobals = definePackageConfig({ runtime }).find(
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
