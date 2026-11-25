import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import {
    findEscapingLinks,
    linkSpecifierEscapesRepository,
} from "./check-links.mjs";

test("an in-repo file specifier is allowed", () => {
    const rootDirectory = mkdtempSync(path.join(tmpdir(), "sgx4u-links-"));
    const packageDirectory = path.join(rootDirectory, "packages", "string");
    assert.equal(
        linkSpecifierEscapesRepository(
            "file:../core",
            packageDirectory,
            rootDirectory,
        ),
        false,
    );
    assert.equal(
        linkSpecifierEscapesRepository(
            "link:../../../../other-repo",
            packageDirectory,
            rootDirectory,
        ),
        true,
    );
});

test("package manifests cannot link outside the repository", () => {
    const rootDirectory = mkdtempSync(
        path.join(tmpdir(), "sgx4u-links-manifest-"),
    );
    const packageDirectory = path.join(rootDirectory, "packages", "string");
    mkdirSync(packageDirectory, { recursive: true });
    writeFileSync(
        path.join(packageDirectory, "package.json"),
        JSON.stringify({
            dependencies: {
                "@sgx4u/ui": "link:../../../../sgx4u-ui/packages/ui",
            },
        }),
    );
    const findings = findEscapingLinks(rootDirectory);
    assert.equal(findings.length, 1);
    assert.equal(findings[0]?.dependencyName, "@sgx4u/ui");
});
