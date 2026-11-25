import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
    listPackReviewPackages,
    listPublishablePackages,
} from "./check-pack.mjs";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));

test("npm publish covers libraries and the pack review still includes workspace tooling", () => {
    const relative = (absolutePath) =>
        path.relative(repositoryRoot, absolutePath).split(path.sep).join("/");
    assert.deepEqual(listPublishablePackages(repositoryRoot).map(relative), [
        "packages/string",
    ]);
    const reviewed = listPackReviewPackages(repositoryRoot).map(relative);
    assert.ok(reviewed.includes("packages/string"));
    assert.ok(reviewed.includes("packages/config/eslint-config"));
    assert.ok(reviewed.includes("packages/config/tsconfig"));
});
