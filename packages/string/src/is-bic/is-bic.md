# `isBIC`

Reports whether a string is an 8 or 11 character BIC.

## Import

```ts
import { isBIC } from "@sgx4u/string";
```

## Signature

```ts
function isBIC(value: unknown): boolean;
```

## Examples

```ts
isBIC("value");
```

## Edge cases

A non-string returns `false`.
