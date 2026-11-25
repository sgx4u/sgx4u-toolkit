import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const templatePath = fileURLToPath(
    new URL(
        "../turbo/generators/templates/package/package.json.hbs",
        import.meta.url,
    ),
);

test("a generated library exports import and require, each with types", () => {
    const template = readFileSync(templatePath, "utf8");
    const importCondition =
        /"import"\s*:\s*\{\s*"types"\s*:\s*"\.\/dist\/index\.d\.ts"\s*,\s*"default"\s*:\s*"\.\/dist\/index\.js"\s*\}/;
    const requireCondition =
        /\{\{#unless \(eq packageKind "config"\)\}\},\s*"require"\s*:\s*\{\s*"types"\s*:\s*"\.\/dist\/index\.d\.cts"\s*,\s*"default"\s*:\s*"\.\/dist\/index\.cjs"\s*\}/;

    assert.match(template, importCondition);
    assert.match(template, requireCondition);
});

test("a generated package keeps version 0.0.0, including a private preset", () => {
    const template = readFileSync(templatePath, "utf8");
    const versionIndex = template.indexOf('"version": "0.0.0",');
    const privateIndex = template.indexOf('"private": true,');

    assert.notEqual(versionIndex, -1);
    assert.ok(versionIndex < privateIndex);
});
