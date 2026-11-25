import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
    listPackReviewPackages,
    listPublishablePackages,
} from "./check-pack.mjs";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));

test("an empty repository has no publishable packages", () => {
    const rootDirectory = mkdtempSync(path.join(tmpdir(), "sgx4u-pack-"));
    mkdirSync(path.join(rootDirectory, "packages", "config"), {
        recursive: true,
    });
    assert.deepEqual(listPublishablePackages(rootDirectory), []);
});

test("workspace tooling is not published and is not pack-reviewed", () => {
    const relative = (absolutePath) =>
        path.relative(repositoryRoot, absolutePath).split(path.sep).join("/");
    const published = new Set(
        listPublishablePackages(repositoryRoot).map(relative),
    );
    const reviewed = new Set(
        listPackReviewPackages(repositoryRoot).map(relative),
    );
    const configDirectory = path.join(repositoryRoot, "packages", "config");

    for (const entry of readdirSync(configDirectory, { withFileTypes: true })) {
        if (!entry.isDirectory()) {
            continue;
        }
        const toolingPath = `packages/config/${entry.name}`;
        assert.equal(published.has(toolingPath), false, toolingPath);
        assert.equal(reviewed.has(toolingPath), false, toolingPath);
    }
});
