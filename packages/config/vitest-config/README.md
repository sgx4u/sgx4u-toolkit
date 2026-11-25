# @sgx4u/vitest-config

Vitest preset: Node environment, tests in `src/**/*.test.ts`.

Universal, edge, and node packages use this environment. The test runner is Node. Which imports the source may use is enforced by `@sgx4u/eslint-config`.

## Install

```sh
pnpm add -D @sgx4u/vitest-config vitest
```

## Examples

```ts
import { definePackageVitestConfig } from "@sgx4u/vitest-config";

export default definePackageVitestConfig();
```

Pass a plain config object to override one field. A `test` object replaces defaults one field at a time, so `environment` stays `node` unless the caller sets it. A function, a promise, an array, or `null` throws. Those values would skip the Node environment and the `src/**/*.test.ts` include.

## Owner

Subhajit Ghosh (`@sgx4u`).

## Status

Experimental (`0.x`).
