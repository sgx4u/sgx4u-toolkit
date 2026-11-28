# `fromUTF8Bytes`

Decodes a `Uint8Array` as UTF-8. Invalid bytes and other types return `undefined`.

## Import

```ts
import { fromUTF8Bytes } from "@sgx4u/string";
```

## Signature

```ts
function fromUTF8Bytes(bytes: unknown): string | undefined;
```

## Examples

```ts
fromUTF8Bytes(new Uint8Array([104, 105]));
```

## Edge cases

A plain array returns `undefined`.
