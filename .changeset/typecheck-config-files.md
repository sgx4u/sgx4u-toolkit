---
"@sgx4u/eslint-config": patch
"@sgx4u/prettier-config": patch
"@sgx4u/tsdown-config": patch
"@sgx4u/vitest-config": patch
---

Typecheck root `*.config.ts` files in the package TypeScript project.

Each package `tsconfig.json` includes `*.config.ts` along with `src`. `rootDir` is not `src`, so `tsdown.config.ts` and `vitest.config.ts` belong to that project and `tsc --noEmit` checks them. `@sgx4u/eslint-config` and `@sgx4u/prettier-config` have a `tsconfig.json` and a `typecheck` script. `@sgx4u/eslint-config` extends `../tsconfig/node.json` and does not depend on `@sgx4u/tsconfig`, because that package already depends on `@sgx4u/eslint-config`. Both packages depend on `@types/node`, which `node.json` loads. `@sgx4u/prettier-config` depends on `@sgx4u/tsconfig`. Published `dist` output is unchanged.
