# `isBase32`

Reports whether a string is base32. Padding is optional.

## Import

```ts
import { isBase32 } from "@sgx4u/string";
```

## Signature

```ts
function isBase32(value: unknown): boolean;
```

## Examples

```ts
isBase32("value");
```

## Edge cases

A non-string returns `false`.
