# `encodeBase64URL`

Base64url without padding.

## Import

```ts
import { encodeBase64URL } from "@sgx4u/string";
```

## Signature

```ts
function encodeBase64URL(value: unknown): string | undefined;
```

## Examples

```ts
encodeBase64URL("hi");
```

## Edge cases

A non-string returns `undefined`.
