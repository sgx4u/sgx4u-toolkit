import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { findForbiddenReferences } from "./check-visibility.mjs";

test("flags private and UI scopes in manifests and source", () => {
    const rootDirectory = mkdtempSync(path.join(tmpdir(), "sgx4u-visibility-"));
    const sourceDirectory = path.join(
        rootDirectory,
        "domains",
        "foundation",
        "example",
        "src",
    );
    mkdirSync(sourceDirectory, { recursive: true });
    writeFileSync(
        path.join(rootDirectory, "package.json"),
        JSON.stringify({
            dependencies: { "@sgx4u-private/pricing-rules": "1.0.0" },
        }),
    );
    writeFileSync(
        path.join(sourceDirectory, "index.ts"),
        'import { button } from "@sgx4u/ui";\nimport { tokens } from "@sgx4u/ui-tokens";\n',
    );
    writeFileSync(
        path.join(sourceDirectory, "notes.md"),
        "Prose may mention @sgx4u/ui because markdown is not scanned.\n",
    );

    const findings = findForbiddenReferences(rootDirectory);
    const names = findings.map((finding) => finding.name).sort();
    assert.deepEqual(names, ["private-scope", "ui-scope", "ui-scope"]);
});

test("skips the guard files that name forbidden scopes", () => {
    const repositoryRoot = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "..",
    );
    const findings = findForbiddenReferences(repositoryRoot);
    assert.equal(findings.length, 0);
});

test("allows other @sgx4u packages", () => {
    const rootDirectory = mkdtempSync(
        path.join(tmpdir(), "sgx4u-visibility-ok-"),
    );
    writeFileSync(
        path.join(rootDirectory, "package.json"),
        JSON.stringify({ dependencies: { "@sgx4u/string": "workspace:^" } }),
    );
    const findings = findForbiddenReferences(rootDirectory);
    assert.equal(findings.length, 0);
});
