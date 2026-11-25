import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { distributionTagForBranch } from "./distribution-tag.mjs";
import {
    gitTagForPackage,
    isRealPackage,
    listRealPackages,
    publishArguments,
    registryHasVersion,
} from "./publish-packages.mjs";

test("stable release branches map to latest and previous", () => {
    assert.equal(distributionTagForBranch("production"), "latest");
    assert.equal(distributionTagForBranch("release/date-time/v1"), "previous");
});

test("develop and beta do not publish committed versions", () => {
    assert.throws(
        () => distributionTagForBranch("develop"),
        /Refusing to publish/,
    );
    assert.throws(
        () => distributionTagForBranch("beta"),
        /Refusing to publish committed versions/,
    );
});

test("other branches are rejected", () => {
    assert.throws(
        () => distributionTagForBranch("main"),
        /Refusing to publish/,
    );
});

test("libraries live in packages/<name> and presets do not publish", () => {
    assert.equal(isRealPackage("packages/date-time"), true);
    assert.equal(isRealPackage("packages/config"), false);
    assert.equal(isRealPackage("packages/config/eslint-config"), false);
    assert.equal(isRealPackage("."), false);
});

test("no library directory means nothing to publish", () => {
    const rootDirectory = mkdtempSync(path.join(tmpdir(), "toolkit-publish-"));
    try {
        assert.deepEqual(listRealPackages(rootDirectory), []);
        mkdirSync(path.join(rootDirectory, "packages", "config", "preset"), {
            recursive: true,
        });
        writeFileSync(
            path.join(
                rootDirectory,
                "packages",
                "config",
                "preset",
                "package.json",
            ),
            JSON.stringify({ name: "@sgx4u/preset", version: "0.0.0" }),
        );
        assert.deepEqual(listRealPackages(rootDirectory), []);
    } finally {
        rmSync(rootDirectory, { recursive: true, force: true });
    }
});

test("a library directory is the publish list", () => {
    const rootDirectory = mkdtempSync(path.join(tmpdir(), "toolkit-publish-"));
    try {
        mkdirSync(path.join(rootDirectory, "packages", "date-time"), {
            recursive: true,
        });
        writeFileSync(
            path.join(rootDirectory, "packages", "date-time", "package.json"),
            JSON.stringify({ name: "@sgx4u/date-time", version: "0.0.0" }),
        );
        assert.deepEqual(listRealPackages(rootDirectory), [
            {
                name: "@sgx4u/date-time",
                version: "0.0.0",
                relativeDirectory: "packages/date-time",
            },
        ]);
    } finally {
        rmSync(rootDirectory, { recursive: true, force: true });
    }
});

test("publish passes the branch dist-tag to one library", () => {
    assert.deepEqual(publishArguments("@sgx4u/date-time", "previous"), [
        "--filter",
        "@sgx4u/date-time",
        "publish",
        "--tag",
        "previous",
        "--access",
        "public",
        "--no-git-checks",
    ]);
});

test("a git tag names the library and the version", () => {
    assert.equal(
        gitTagForPackage("@sgx4u/date-time", "0.1.0"),
        "@sgx4u/date-time@0.1.0",
    );
});

test("an npm view match means that version is already published", () => {
    assert.equal(
        registryHasVersion({ status: 0, stdout: "0.1.0\n" }, "0.1.0"),
        true,
    );
    assert.equal(registryHasVersion({ status: 1, stdout: "" }, "0.1.0"), false);
});
