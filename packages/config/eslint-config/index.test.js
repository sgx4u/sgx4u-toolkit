import assert from "node:assert/strict";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import { definePackageConfig } from "./index.js";

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
        .filter((message) => message.ruleId === "no-restricted-imports");
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
