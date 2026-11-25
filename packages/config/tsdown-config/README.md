# @sgx4u/tsdown-config

One tsdown preset for published `@sgx4u` libraries: ESM and CommonJS, declarations, source maps, dependencies left external.

With `"type": "module"`, the build writes `dist/index.js` and `dist/index.d.ts` for `import`, and `dist/index.cjs` and `dist/index.d.cts` for `require`. The export map is not rewritten by the build. Packages declare `@sgx4u/source`, `import`, and `require` themselves so the source condition never dangles.

## Install

```sh
pnpm add -D @sgx4u/tsdown-config tsdown
```

## Examples

```ts
import { defineLibraryConfig } from "@sgx4u/tsdown-config";

export default defineLibraryConfig();
```

## Owner

Subhajit Ghosh (`@sgx4u`).

## Status

Experimental (`0.x`).
