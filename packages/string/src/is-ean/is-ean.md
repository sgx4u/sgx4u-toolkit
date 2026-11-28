# `isEAN`

Reports whether a string is an EAN-8 or EAN-13.

## Import

```ts
import { isEAN } from "@sgx4u/string";
```

## Signature

```ts
function isEAN(value: unknown): boolean;
```

## Examples

```ts
isEAN("value");
```

## Edge cases

A non-string returns `false`.
