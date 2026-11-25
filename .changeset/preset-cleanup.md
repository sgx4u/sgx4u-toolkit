---
"@sgx4u/eslint-config": patch
"@sgx4u/prettier-config": minor
"@sgx4u/tsconfig": patch
"@sgx4u/vitest-config": patch
---

Clean up the unpublished presets. Nothing here is on npm yet. The bumps record what the first release will contain.

`@sgx4u/eslint-config` no longer loads `eslint-plugin-boundaries`. That plugin repeated the `@sgx4u-private` ban that the import rules already apply to `src` and to root scripts. `turbo boundaries` is unchanged. An unknown `runtime` throws. It used to fall through to the Node globals and the Node import rules. `require()` and `import()` of a banned module are rejected too. `no-restricted-imports` only sees static `import` and `export` declarations, so those calls were previously allowed.

`@sgx4u/prettier-config` sets `tabWidth` to 4. Prettier's default is 2. This repository indents with 4 spaces via `.editorconfig`, and the preset is what other checkouts load. The other options are still the Prettier 3 defaults, written down so a later default does not reformat consumers. A project that already formatted with this preset and no editorconfig indent will be rewritten to four spaces.

`@sgx4u/tsconfig` `node.json` no longer repeats `lib: ["ES2022"]`. That list is `base.json`, so a change to the baseline now reaches Node packages. The package no longer depends on `@types/node`. `node.json` still sets `"types": ["node"]`, and TypeScript resolves that from the project being compiled. The README already told Node packages to depend on `@types/node` themselves.

`@sgx4u/vitest-config` accepts a config object. A function or a promise used to be returned unchanged, which skipped the Node environment and the `src/**/*.test.ts` include. Those values now throw. A caller's `test` object still overrides one field at a time.
