import assert from "node:assert/strict";
import { test } from "node:test";
// Node loads this test by its `.ts` path and does not map a `.js` specifier
// back to `.ts`, so the import names the implementation file. `src/index.ts`
// re-exports that file, and `tsc` checks the re-export.
import { defineLibraryConfig } from "./define-library-config.ts";

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

test("a platform override leaves fixedExtension false", () => {
    const config = defineLibraryConfig({ platform: "node" });
    assert.equal(config.platform, "node");
    assert.equal(config.fixedExtension, false);
});

test("a function, promise, array, or null throws", () => {
    const rejectedValues = [() => ({}), Promise.resolve({}), [], null] as const;
    for (const options of rejectedValues) {
        assert.throws(
            () =>
                defineLibraryConfig(
                    options as Parameters<typeof defineLibraryConfig>[0],
                ),
            (error: unknown) => {
                assert.ok(error instanceof TypeError);
                assert.match(
                    error.message,
                    /options must be a tsdown config object/,
                );
                assert.ok(
                    error.message.includes(
                        Object.prototype.toString.call(options),
                    ),
                );
                return true;
            },
        );
    }
});
