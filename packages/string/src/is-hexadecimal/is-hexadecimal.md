# `isHexadecimal`

Reports whether a string is hexadecimal digits with no `0x` prefix.

## Import

```ts
import { isHexadecimal } from "@sgx4u/string";
```

## Signature

```ts
function isHexadecimal(value: unknown): boolean;
```

## Examples

```ts
isHexadecimal("dead");
```

## Edge cases

An empty string and `0x10` return `false`.
