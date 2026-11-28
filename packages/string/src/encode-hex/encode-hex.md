# `encodeHex`

Lowercase UTF-8 hex.

## Import

```ts
import { encodeHex } from "@sgx4u/string";
```

## Signature

```ts
function encodeHex(value: unknown): string | undefined;
```

## Examples

```ts
encodeHex("hi");
```

## Edge cases

A non-string returns `undefined`.
