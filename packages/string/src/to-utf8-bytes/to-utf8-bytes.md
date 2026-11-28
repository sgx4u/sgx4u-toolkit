# `toUTF8Bytes`

UTF-8 bytes.

## Import

```ts
import { toUTF8Bytes } from "@sgx4u/string";
```

## Signature

```ts
function toUTF8Bytes(value: unknown): Uint8Array | undefined;
```

## Examples

```ts
toUTF8Bytes("hi");
```

## Edge cases

A non-string returns `undefined`.
