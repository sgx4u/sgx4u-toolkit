# @sgx4u/string

Small string helpers with no Node, DOM, or React dependency. They run in browsers, Node 22.12+, Cloudflare Workers, and React Native.

## Install

```sh
pnpm add @sgx4u/string
```

Node 22.12 or newer. The package is ESM-only. CommonJS callers load it with `require()` on that Node line.

## API

### `isBlank(value: string): boolean`

Returns true when `value` is empty or only whitespace.

### `collapseWhitespace(value: string): string`

Trims `value` and replaces each internal whitespace run with a single space.

## Examples

```ts
import { collapseWhitespace, isBlank } from "@sgx4u/string";

isBlank("  ");
collapseWhitespace("  a \n b  ");
```

## Owner

Subhajit Ghosh (`@sgx4u`).

## Status

Experimental (`0.x`). Breaking changes are allowed in minor versions until 1.0.0.
