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

Pass a plain config object to override one field. A `test` object replaces defaults one field at a time, so `environment` stays `node` unless the caller sets it. A function, a promise, an array, or `null` throws `TypeError`. The message names `options` and the received value. Those values would skip the Node environment and the `src/**/*.test.ts` include.

This package's export map lists `@sgx4u/source` before `import` and `require`, pointing at `src/index.ts`. TypeScript uses that condition when `customConditions` includes `@sgx4u/source`, which `@sgx4u/tsconfig/base.json` sets. Other resolvers load `dist`. `types` stays under `import` and `require`, after `@sgx4u/source`, so the source condition stays reachable.

## Owner

Subhajit Ghosh (`@sgx4u`).

## Status

Experimental (`0.x`).
