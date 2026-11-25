import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { listPublishablePackages } from "./check-pack.mjs";

test("an empty repository has no publishable packages", () => {
    const rootDirectory = mkdtempSync(path.join(tmpdir(), "sgx4u-pack-"));
    mkdirSync(path.join(rootDirectory, "packages", "config"), {
        recursive: true,
    });
    assert.deepEqual(listPublishablePackages(rootDirectory), []);
});

test("the repository publishes the config presets", () => {
    const rootDirectory = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "..",
    );
    const relativeDirectories = listPublishablePackages(rootDirectory).map(
        (packageDirectory) => path.relative(rootDirectory, packageDirectory),
    );
    assert.deepEqual(relativeDirectories, [
        "packages/config/eslint-config",
        "packages/config/prettier-config",
        "packages/config/tsconfig",
        "packages/config/tsdown-config",
        "packages/config/vitest-config",
    ]);
});
