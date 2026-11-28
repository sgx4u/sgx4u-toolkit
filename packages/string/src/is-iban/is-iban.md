# `isIBAN`

Reports whether a string is an IBAN: known country length and MOD-97 checksum 1. An unknown country returns `false`.

## Import

```ts
import { isIBAN } from "@sgx4u/string";
```

## Signature

```ts
function isIBAN(value: unknown): boolean;
```

## Examples

```ts
isIBAN("value");
```

## Edge cases

A non-string returns `false`.
