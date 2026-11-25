# @sgx4u/tsdown-config

tsdown preset for published `@sgx4u` libraries: ESM and CommonJS, declarations, source maps, and dependencies left external.

With `"type": "module"`, the build writes `dist/index.js` and `dist/index.d.ts` for `import`, and `dist/index.cjs` and `dist/index.d.cts` for `require`. Callers declare their own export map, including the `@sgx4u/source` condition.

This package's export map lists `@sgx4u/source` before `import` and `require`, pointing at `src/index.ts`. TypeScript uses that condition when `customConditions` includes `@sgx4u/source`, which `@sgx4u/tsconfig/base.json` sets. Other resolvers load `dist`. `types` stays under `import` and `require`, after `@sgx4u/source`, so the source condition stays reachable.

## Install

```sh
pnpm add -D @sgx4u/tsdown-config tsdown
```

## Examples

```ts
import { defineLibraryConfig } from "@sgx4u/tsdown-config";

export default defineLibraryConfig();
```

The preset sets `platform` to `"neutral"`, a platform-agnostic target. Universal and edge packages use that. Node packages pass `{ platform: "node" }`. tsdown builds the CommonJS format with the `node` platform either way.

Pass a plain object. Each field replaces that preset field. Arrays and nested objects are replaced as a whole. `fixedExtension` stays false unless the caller sets it, including when the caller sets `platform`. A function, a promise, an array, or `null` throws `TypeError`. The message names `options` and the received value. Spreading those values would drop the caller's overrides and return the preset alone.

## Owner

Subhajit Ghosh (`@sgx4u`).

## Status

Experimental (`0.x`).
