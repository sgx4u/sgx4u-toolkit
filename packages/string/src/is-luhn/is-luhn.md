# `isLuhn`

Reports whether the digits in a string pass the Luhn check.

## Import

```ts
import { isLuhn } from "@sgx4u/string";
```

## Signature

```ts
function isLuhn(value: unknown): boolean;
```

## Examples

```ts
isLuhn("value");
```

## Edge cases

A non-string returns `false`.
