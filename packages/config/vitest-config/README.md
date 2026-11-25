# @sgx4u/vitest-config

Vitest preset: Node environment, tests in `src/**/*.test.ts`.

Universal, edge, and node packages all use this environment. The test runner is Node. Which imports the source may use is enforced by `@sgx4u/eslint-config`, not by the Vitest environment.

## Install

```sh
pnpm add -D @sgx4u/vitest-config vitest
```

## Examples

```ts
import { definePackageVitestConfig } from "@sgx4u/vitest-config";

export default definePackageVitestConfig();
```

Pass a config object to override one field. A `test` object replaces defaults one field at a time, so `environment` stays `node` unless the caller sets it. A function or a promise throws. Returning it unchanged would skip the defaults.

## Owner

Subhajit Ghosh (`@sgx4u`).

## Status

Experimental (`0.x`).
