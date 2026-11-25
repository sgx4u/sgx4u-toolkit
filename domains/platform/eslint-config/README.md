# @sgx4u/eslint-config

ESLint flat config for the toolkit. It turns on TypeScript recommended rules, Prettier compatibility, Turborepo environment checks, and boundaries rules that reject `@sgx4u-private` and `@sgx4u/ui*` imports.

`turbo boundaries` enforces tier direction: a foundation package cannot depend on an adapter. This package enforces the runtime rules for the `tier` you pass, and rejects `@sgx4u-private` and `@sgx4u/ui*` imports.

## Install

```sh
pnpm add -D @sgx4u/eslint-config eslint typescript
```

## Examples

```js
import { definePackageConfig } from "@sgx4u/eslint-config";

export default definePackageConfig({
  tier: "foundation",
  runtime: "universal",
});
```

`runtime: "universal"` rejects `node:*` and React. `runtime: "edge"` rejects Node-only built-ins outside the Workers `nodejs_compat` subset. `runtime: "node"` allows Node and still rejects React, which lives in `sgx4u-ui`.

## Owner

Subhajit Ghosh (`@sgx4u`).

## Status

Experimental (`0.x`).
