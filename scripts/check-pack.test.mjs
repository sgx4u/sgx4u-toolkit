import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
    listPackReviewPackages,
    listPublishablePackages,
} from "./check-pack.mjs";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));

test("workspace tooling is reviewed and is not on the npm publish list", () => {
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
        assert.equal(reviewed.has(toolingPath), true, toolingPath);
    }
});
