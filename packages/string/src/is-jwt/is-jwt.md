# `isJWT`

Reports whether a string has three base64url parts. The signature is not verified.

## Import

```ts
import { isJWT } from "@sgx4u/string";
```

## Signature

```ts
function isJWT(value: unknown): boolean;
```

## Examples

```ts
isJWT("value");
```

## Edge cases

A non-string returns `false`.
