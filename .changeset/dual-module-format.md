---
"@sgx4u/eslint-config": patch
"@sgx4u/prettier-config": patch
"@sgx4u/string": patch
"@sgx4u/tsconfig": patch
"@sgx4u/tsdown-config": patch
"@sgx4u/vitest-config": patch
---

Publish ESM and CommonJS from each package, and record the flat package paths.

`import` resolves `dist/index.js` with `dist/index.d.ts`. `require` resolves `dist/index.cjs` with `dist/index.d.cts`. Hand-written presets keep their ESM source as the import entry and add a CommonJS build. `@sgx4u/tsconfig` JSON files resolve for both `import` and `require`. `repository.directory` and `homepage` now point at `packages/<name>` or `packages/config/<name>`.
