import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
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
    assert.equal(distributionTagForBranch("release/string/v1"), "previous");
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
    assert.equal(isRealPackage("packages/string"), true);
    assert.equal(isRealPackage("packages/config"), false);
    assert.equal(isRealPackage("packages/config/eslint-config"), false);
    assert.equal(isRealPackage("."), false);
});

test("the repository's real packages are the libraries", () => {
    const packageNames = listRealPackages(
        fileURLToPath(new URL("..", import.meta.url)),
    ).map((packageInfo) => packageInfo.name);
    assert.deepEqual(packageNames, ["@sgx4u/string"]);
});

test("publish passes the branch dist-tag to one library", () => {
    assert.deepEqual(publishArguments("@sgx4u/string", "previous"), [
        "--filter",
        "@sgx4u/string",
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
        gitTagForPackage("@sgx4u/string", "0.1.0"),
        "@sgx4u/string@0.1.0",
    );
});

test("an npm view match means that version is already published", () => {
    assert.equal(
        registryHasVersion({ status: 0, stdout: "0.1.0\n" }, "0.1.0"),
        true,
    );
    assert.equal(registryHasVersion({ status: 1, stdout: "" }, "0.1.0"), false);
});
