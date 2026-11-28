# `isBase64URL`

Reports whether a string is unpadded base64url.

## Import

```ts
import { isBase64URL } from "@sgx4u/string";
```

## Signature

```ts
function isBase64URL(value: unknown): boolean;
```

## Examples

```ts
isBase64URL("value");
```

## Edge cases

A non-string returns `false`.
