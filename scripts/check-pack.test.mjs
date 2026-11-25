import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { isDeniedPackPath, listPublishablePackages } from "./check-pack.mjs";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));

test("an empty repository has no publishable packages", () => {
    const rootDirectory = mkdtempSync(path.join(tmpdir(), "sgx4u-pack-"));
    mkdirSync(path.join(rootDirectory, "packages", "config"), {
        recursive: true,
    });
    assert.deepEqual(listPublishablePackages(rootDirectory), []);
});

test("workspace tooling is not on the npm publish list", () => {
    const relative = (absolutePath) =>
        path.relative(repositoryRoot, absolutePath).split(path.sep).join("/");
    const published = new Set(
        listPublishablePackages(repositoryRoot).map(relative),
    );
    const configDirectory = path.join(repositoryRoot, "packages", "config");

    for (const entry of readdirSync(configDirectory, { withFileTypes: true })) {
        if (!entry.isDirectory()) {
            continue;
        }
        const toolingPath = `packages/config/${entry.name}`;
        assert.equal(published.has(toolingPath), false, toolingPath);
    }
});

test("private presets keep version 0.0.0 so a library can pack", () => {
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
        assert.equal(packageManifest.version, "0.0.0", entry.name);
    }
});

test("a pack preview rejects tests and function guides", () => {
    assert.equal(
        isDeniedPackPath("src/package-identifier/package-identifier.test.ts"),
        true,
    );
    assert.equal(
        isDeniedPackPath("src/package-identifier/package-identifier.md"),
        true,
    );
    assert.equal(isDeniedPackPath("README.md"), false);
    assert.equal(isDeniedPackPath("CHANGELOG.md"), false);
    assert.equal(
        isDeniedPackPath("src/package-identifier/package-identifier.ts"),
        false,
    );
    assert.equal(
        isDeniedPackPath("src/package-identifier/package-identifier.types.ts"),
        false,
    );
    assert.equal(isDeniedPackPath("dist/index.d.ts"), false);
    assert.equal(isDeniedPackPath("dist/index.d.cts"), false);
});
