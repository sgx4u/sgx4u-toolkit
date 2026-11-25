import assert from "node:assert/strict";
import { test } from "node:test";
import { defineLibraryConfig } from "./index.ts";

test("builds ESM and CommonJS with a neutral platform", () => {
    const config = defineLibraryConfig();
    assert.deepEqual(config.entry, ["src/index.ts"]);
    assert.deepEqual(config.format, ["esm", "cjs"]);
    assert.equal(config.platform, "neutral");
    assert.equal(config.dts, true);
    assert.equal(config.fixedExtension, false);
});

test("caller options override the preset", () => {
    const config = defineLibraryConfig({
        platform: "node",
        entry: ["src/main.ts"],
    });
    assert.equal(config.platform, "node");
    assert.deepEqual(config.entry, ["src/main.ts"]);
    assert.deepEqual(config.format, ["esm", "cjs"]);
});
