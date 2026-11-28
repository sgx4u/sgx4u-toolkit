# `isNumericString`

Reports whether a string is ASCII digits, with an optional leading sign and one decimal point.

## Import

```ts
import { isNumericString } from "@sgx4u/string";
```

## Signature

```ts
function isNumericString(value: unknown): boolean;
```

## Examples

```ts
isNumericString("42");
```

## Edge cases

A sign or decimal is rejected unless the matching flag is true.
