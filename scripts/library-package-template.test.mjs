/**
 * Checks the package generator templates without running the prompts.
 *
 * `tsconfigExtendsFor` is imported from the generator and substituted into
 * `tsconfig.json.hbs`, which is the value Plop inserts at render time.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { tsconfigExtendsFor } from "../turbo/generators/config.ts";

/**
 * @param {string} fileName
 */
function readTemplate(fileName) {
    return readFileSync(
        fileURLToPath(
            new URL(
                `../turbo/generators/templates/package/${fileName}`,
                import.meta.url,
            ),
        ),
        "utf8",
    );
}

/**
 * @param {"config" | "regular"} packageKind
 * @param {"universal" | "edge" | "node"} runtimeName
 */
function renderedTsconfigExtends(packageKind, runtimeName) {
    const template = readTemplate("tsconfig.json.hbs");
    assert.ok(template.includes("{{{tsconfigExtends}}}"));
    const rendered = template.replace(
        "{{{tsconfigExtends}}}",
        tsconfigExtendsFor(packageKind, runtimeName),
    );
    return JSON.parse(rendered).extends;
}

test("a generated library exports import and require, each with types", () => {
    const template = readTemplate("package.json.hbs");
    const importCondition =
        /"import"\s*:\s*\{\s*"types"\s*:\s*"\.\/dist\/index\.d\.ts"\s*,\s*"default"\s*:\s*"\.\/dist\/index\.js"\s*\}/;
    const requireCondition =
        /\{\{#unless \(eq packageKind "config"\)\}\},\s*"require"\s*:\s*\{\s*"types"\s*:\s*"\.\/dist\/index\.d\.cts"\s*,\s*"default"\s*:\s*"\.\/dist\/index\.cjs"\s*\}/;

    assert.match(template, importCondition);
    assert.match(template, requireCondition);
});

test("a generated package keeps version 0.0.0, including a private preset", () => {
    const template = readTemplate("package.json.hbs");
    const versionIndex = template.indexOf('"version": "0.0.0",');
    const privateIndex = template.indexOf('"private": true,');

    assert.notEqual(versionIndex, -1);
    assert.ok(versionIndex < privateIndex);
});

test("a universal library extends the library preset", () => {
    assert.equal(
        renderedTsconfigExtends("regular", "universal"),
        "@sgx4u/tsconfig/library.json",
    );
});

test("edge and Node libraries extend the library preset, then their runtime preset", () => {
    assert.deepEqual(renderedTsconfigExtends("regular", "edge"), [
        "@sgx4u/tsconfig/library.json",
        "@sgx4u/tsconfig/edge.json",
    ]);
    assert.deepEqual(renderedTsconfigExtends("regular", "node"), [
        "@sgx4u/tsconfig/library.json",
        "@sgx4u/tsconfig/node.json",
    ]);
});

test("a config preset extends only the Node preset", () => {
    assert.equal(
        renderedTsconfigExtends("config", "node"),
        "@sgx4u/tsconfig/node.json",
    );
});

test("a generated library scaffolds one folder per function", () => {
    const indexTemplate = readTemplate("src/index.ts.hbs");
    assert.match(
        indexTemplate,
        /export \{ packageIdentifier \} from "\.\/package-identifier\/package-identifier\.js";/,
    );
    assert.match(
        indexTemplate,
        /export type \{ PackageIdentifier \} from "\.\/package-identifier\/package-identifier\.types\.js";/,
    );

    const implementation = readTemplate(
        "src/package-identifier/package-identifier.ts.hbs",
    );
    assert.match(implementation, /@returns/);
    assert.match(implementation, /@remarks/);
    assert.match(implementation, /@example/);
    assert.match(implementation, /: PackageIdentifier/);

    const typesTemplate = readTemplate(
        "src/package-identifier/package-identifier.types.ts.hbs",
    );
    assert.match(typesTemplate, /export type PackageIdentifier = string;/);

    const testTemplate = readTemplate(
        "src/package-identifier/package-identifier.test.ts.hbs",
    );
    assert.match(testTemplate, /type PackageIdentifier/);

    const guide = readTemplate(
        "src/package-identifier/package-identifier.md.hbs",
    );
    assert.match(guide, /## Import/);
    assert.match(guide, /## Signature/);
    assert.match(guide, /## Accepted inputs/);
    assert.match(guide, /## Examples/);
    assert.match(guide, /## Edge cases/);

    const manifest = readTemplate("package.json.hbs");
    assert.match(manifest, /"!src\/\*\*\/\*\.test\.ts"/);
    assert.match(manifest, /"!src\/\*\*\/\*\.md"/);

    const readme = readTemplate("README.md.hbs");
    assert.match(
        readme,
        /\]\(\.\/src\/package-identifier\/package-identifier\.md\)/,
    );
});

test("a generated function folder has no barrel index", () => {
    assert.throws(
        () => readTemplate("src/package-identifier/index.ts.hbs"),
        /ENOENT/,
    );
});
