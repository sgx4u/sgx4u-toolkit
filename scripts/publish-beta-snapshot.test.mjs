import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
    assertBetaSnapshotBranch,
    packagesWithChangedVersions,
    readPackageVersions,
} from "./publish-beta-snapshot.mjs";

test("snapshot publish only includes packages whose version changed", () => {
    const versionsBefore = new Map([
        ["@sgx4u/string", "0.0.0"],
        ["@sgx4u/tsconfig", "0.0.0"],
    ]);
    const versionsAfter = new Map([
        ["@sgx4u/string", "0.0.0-beta-1732521600000"],
        ["@sgx4u/tsconfig", "0.0.0"],
    ]);
    assert.deepEqual(
        packagesWithChangedVersions(versionsBefore, versionsAfter),
        [
            {
                packageName: "@sgx4u/string",
                version: "0.0.0-beta-1732521600000",
            },
        ],
    );
});

test("snapshots run on the beta branch only", () => {
    assert.doesNotThrow(() => assertBetaSnapshotBranch("beta"));
    assert.doesNotThrow(() => assertBetaSnapshotBranch(undefined));
    assert.throws(
        () => assertBetaSnapshotBranch("develop"),
        /Refusing to publish a beta snapshot/,
    );
    assert.throws(
        () => assertBetaSnapshotBranch("production"),
        /Refusing to publish a beta snapshot/,
    );
});

test("snapshot versions stay 0.0.0 prereleases and are not committed by Changesets", () => {
    const config = JSON.parse(
        readFileSync(
            new URL("../.changeset/config.json", import.meta.url),
            "utf8",
        ),
    );
    assert.equal(config.commit, false);
    assert.equal(config.snapshot.useCalculatedVersion, false);
    assert.equal(config.snapshot.prereleaseTemplate, "{tag}-{timestamp}");
});

test("the repository versions can be read without publishing", () => {
    const versions = readPackageVersions(
        new URL("..", import.meta.url).pathname,
    );
    assert.equal(versions.get("@sgx4u/string"), "0.0.0");
    assert.equal(versions.has("@sgx4u/eslint-config"), false);
    assert.equal(versions.has("@sgx4u/tsconfig"), false);
});
