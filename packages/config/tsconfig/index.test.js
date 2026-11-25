import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

/**
 * @param {string} fileName
 */
function readPreset(fileName) {
    return JSON.parse(readFileSync(new URL(fileName, import.meta.url), "utf8"));
}

test("base.json is the strict ESM baseline", () => {
    const base = readPreset("./base.json");
    assert.deepEqual(base.compilerOptions.lib, ["ES2022"]);
    assert.deepEqual(base.compilerOptions.types, []);
    assert.deepEqual(base.compilerOptions.customConditions, ["@sgx4u/source"]);
    assert.equal(base.compilerOptions.strict, true);
    assert.equal(base.compilerOptions.module, "NodeNext");
});

test("library.json adds declaration settings on top of the baseline", () => {
    const library = readPreset("./library.json");
    assert.equal(library.extends, "./base.json");
    assert.equal(library.compilerOptions.isolatedDeclarations, true);
    assert.equal(library.compilerOptions.declaration, true);
    assert.equal("lib" in library.compilerOptions, false);
    assert.equal("types" in library.compilerOptions, false);
});

test("node.json selects Node types and inherits lib from the baseline", () => {
    const node = readPreset("./node.json");
    assert.equal(node.extends, "./base.json");
    assert.deepEqual(node.compilerOptions.types, ["node"]);
    assert.equal("lib" in node.compilerOptions, false);
});

test("edge.json adds the WebWorker library and clears types", () => {
    const edge = readPreset("./edge.json");
    assert.equal(edge.extends, "./base.json");
    assert.deepEqual(edge.compilerOptions.lib, ["ES2022", "WebWorker"]);
    assert.deepEqual(edge.compilerOptions.types, []);
});

test("workers.json is not part of the preset", () => {
    assert.equal(existsSync(new URL("./workers.json", import.meta.url)), false);
});
