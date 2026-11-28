import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import {
    assertBetaSnapshotBranch,
    packagesWithChangedVersions,
    readPackageVersions,
} from "./publish-beta-snapshot.mjs";

test("snapshot publish only includes packages whose version changed", () => {
    const versionsBefore = new Map([
        ["@sgx4u/date-time", "0.0.0"],
        ["@sgx4u/example", "0.0.0"],
    ]);
    const versionsAfter = new Map([
        ["@sgx4u/date-time", "0.0.0-beta-1732521600000"],
        ["@sgx4u/example", "0.0.0"],
    ]);
    assert.deepEqual(
        packagesWithChangedVersions(versionsBefore, versionsAfter),
        [
            {
                packageName: "@sgx4u/date-time",
                version: "0.0.0-beta-1732521600000",
            },
        ],
    );
});

test("an empty version list publishes nothing", () => {
    assert.deepEqual(packagesWithChangedVersions(new Map(), new Map()), []);
});

test("a repository with no package manifests has no versions", () => {
    const rootDirectory = mkdtempSync(path.join(tmpdir(), "sgx4u-snapshot-"));
    mkdirSync(path.join(rootDirectory, "packages", "config"), {
        recursive: true,
    });
    assert.equal(readPackageVersions(rootDirectory).size, 0);
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
    for (const [packageName, version] of versions) {
        assert.equal(version, "0.0.0", packageName);
    }
    assert.equal(versions.has("@sgx4u/eslint-config"), false);
    assert.equal(versions.has("@sgx4u/tsconfig"), false);
    assert.equal(versions.get("@sgx4u/boolean"), "0.0.0");
    assert.equal(versions.get("@sgx4u/date-time"), "0.0.0");
    assert.equal(versions.get("@sgx4u/number"), "0.0.0");
    assert.equal(versions.size, 3);
});
