# @sgx4u/eslint-config

ESLint flat config for the toolkit. It turns on TypeScript recommended rules, Prettier compatibility, Turborepo environment checks, and boundaries rules that reject `@sgx4u-private` imports.

`turbo boundaries` keeps `packages/config` from depending on `packages/<name>`. This package enforces the runtime import rules for the `runtime` you pass, and rejects `@sgx4u-private` imports.

## Install

```sh
pnpm add -D @sgx4u/eslint-config eslint typescript
```

## Examples

```js
import { definePackageConfig } from "@sgx4u/eslint-config";

export default definePackageConfig({
    runtime: "universal",
});
```

`runtime` is `universal`, `edge`, or `node`. `runtime: "universal"` rejects Node built-ins. `runtime: "edge"` rejects Node-only built-ins outside the Workers `nodejs_compat` subset. `runtime: "node"` allows Node built-ins.

## Owner

Subhajit Ghosh (`@sgx4u`).

## Status

Experimental (`0.x`).
