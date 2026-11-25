# @sgx4u/string

String helpers for browsers, Node 22.12+, Cloudflare Workers, and React Native.

## Install

```sh
pnpm add @sgx4u/string
```

Node 22.12 or newer. `import` loads the ESM build. `require()` loads the CommonJS build.

## API

### `isBlank(value: string): boolean`

Returns true when `value` is empty or only whitespace. Whitespace is the set `String.prototype.trim` removes. `value` is left unchanged.

### `collapseWhitespace(value: string): string`

Trims `value` and replaces each internal whitespace run with a single space. Whitespace is the same set. `value` is left unchanged.

`src/index.ts` re-exports both functions. Each one lives in its own folder under `src`, with the test beside the implementation.

## Examples

```ts
import { collapseWhitespace, isBlank } from "@sgx4u/string";

isBlank("  ");
collapseWhitespace("  a \n b  ");
```

## Owner

Subhajit Ghosh (`@sgx4u`).

## Status

Experimental (`0.x`). Breaking changes may land in minor versions until 1.0.0.
