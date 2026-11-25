import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import {
    isLibraryChangelog,
    rewriteChangelogFiles,
    versionCommandArguments,
} from "./version-packages.mjs";

test("version arguments stay the Changesets version command", () => {
    assert.deepEqual(versionCommandArguments(), [
        "exec",
        "changeset",
        "version",
    ]);
    assert.deepEqual(versionCommandArguments(["--snapshot", "beta"]), [
        "exec",
        "changeset",
        "version",
        "--snapshot",
        "beta",
    ]);
});

test("rewrite updates a changelog that still has release markers", () => {
    const rootDirectory = mkdtempSync(path.join(tmpdir(), "sgx4u-version-"));
    const packageDirectory = path.join(rootDirectory, "packages", "example");
    mkdirSync(packageDirectory, { recursive: true });
    writeFileSync(
        path.join(packageDirectory, "CHANGELOG.md"),
        [
            "# @sgx4u/example",
            "",
            "## 0.1.0",
            "",
            "### Minor Changes",
            "",
            "<!-- changelog-date: 2026-11-25 -->",
            "<!-- changelog-summary -->",
            "First release of the example package.",
            "<!-- /changelog-summary -->",
            "<!-- changelog-entry: Added -->",
            "`formatLabel` returns the label callers display.",
            "<!-- /changelog-entry -->",
            "",
        ].join("\n"),
    );
    const rewritten = rewriteChangelogFiles(rootDirectory);
    assert.deepEqual(rewritten, ["packages/example/CHANGELOG.md"]);
    const changelog = readFileSync(
        path.join(packageDirectory, "CHANGELOG.md"),
        "utf8",
    );
    assert.match(changelog, /## 0\.1\.0 — 2026-11-25/);
    assert.doesNotMatch(changelog, /### Minor Changes/);
    assert.deepEqual(rewriteChangelogFiles(rootDirectory), []);
});

test("the root changelog index is not rewritten with library notes", () => {
    const rootDirectory = mkdtempSync(path.join(tmpdir(), "sgx4u-version-"));
    const packageDirectory = path.join(rootDirectory, "packages", "example");
    mkdirSync(packageDirectory, { recursive: true });
    const rootChangelog = [
        "# Changelog",
        "",
        "Per-library changelogs live in each library's `CHANGELOG.md` and are linked from here once that library is published.",
        "",
        "## 0.1.0",
        "",
        "<!-- changelog-entry: Added -->",
        "`formatLabel` stays in the library changelog.",
        "<!-- /changelog-entry -->",
        "",
    ].join("\n");
    writeFileSync(path.join(rootDirectory, "CHANGELOG.md"), rootChangelog);
    writeFileSync(
        path.join(packageDirectory, "CHANGELOG.md"),
        [
            "# @sgx4u/example",
            "",
            "## 0.1.0",
            "",
            "<!-- changelog-date: 2026-11-25 -->",
            "<!-- changelog-entry: Added -->",
            "`formatLabel` returns the label callers display.",
            "<!-- /changelog-entry -->",
            "",
        ].join("\n"),
    );

    assert.equal(isLibraryChangelog("CHANGELOG.md"), false);
    assert.equal(isLibraryChangelog("packages/example/CHANGELOG.md"), true);
    const rewritten = rewriteChangelogFiles(rootDirectory);
    assert.deepEqual(rewritten, ["packages/example/CHANGELOG.md"]);
    assert.equal(
        readFileSync(path.join(rootDirectory, "CHANGELOG.md"), "utf8"),
        rootChangelog,
    );
});
