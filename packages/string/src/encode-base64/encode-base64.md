# `encodeBase64`

Standard Base64 with padding.

## Import

```ts
import { encodeBase64 } from "@sgx4u/string";
```

## Signature

```ts
function encodeBase64(value: unknown): string | undefined;
```

## Examples

```ts
encodeBase64("hi");
```

## Edge cases

A non-string returns `undefined`.
