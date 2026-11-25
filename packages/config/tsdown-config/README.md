# @sgx4u/tsdown-config

tsdown preset for published `@sgx4u` libraries: ESM and CommonJS, declarations, source maps, and dependencies left external.

With `"type": "module"`, the build writes `dist/index.js` and `dist/index.d.ts` for `import`, and `dist/index.cjs` and `dist/index.d.cts` for `require`. Packages declare the export map themselves, including the `@sgx4u/source` condition.

## Install

```sh
pnpm add -D @sgx4u/tsdown-config tsdown
```

## Examples

```ts
import { defineLibraryConfig } from "@sgx4u/tsdown-config";

export default defineLibraryConfig();
```

The preset sets `platform` to `"neutral"`, a platform-agnostic target. Universal and edge packages use that. Node packages pass `{ platform: "node" }`. tsdown builds the CommonJS format with the `node` platform either way. Caller options override the preset.

## Owner

Subhajit Ghosh (`@sgx4u`).

## Status

Experimental (`0.x`).
