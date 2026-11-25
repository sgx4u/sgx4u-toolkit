# @sgx4u/tsdown-config

One tsdown preset for published `@sgx4u` libraries: ESM, declarations, source maps, dependencies left external.

The export map is not rewritten by the build. Packages declare `@sgx4u/source`, `types`, and `default` themselves so the source condition never dangles.

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
