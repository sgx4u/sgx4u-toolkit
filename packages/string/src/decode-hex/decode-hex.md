# `decodeHex`

Decodes lowercase or uppercase hexadecimal. An odd length returns `undefined`.

## Import

```ts
import { decodeHex } from "@sgx4u/string";
```

## Signature

```ts
function decodeHex(value: unknown): string | undefined;
```

## Examples

```ts
decodeHex("6869");
```

## Edge cases

A non-hex digit returns `undefined`.
