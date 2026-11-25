import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import {
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
