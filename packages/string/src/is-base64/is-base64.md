# `isBase64`

Reports whether a string is Base64. Padding is optional by default.

## Import

```ts
import { isBase64 } from "@sgx4u/string";
```

## Signature

```ts
function isBase64(value: unknown): boolean;
```

## Examples

```ts
isBase64("value");
```

## Edge cases

A non-string returns `false`.
