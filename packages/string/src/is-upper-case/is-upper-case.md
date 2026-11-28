# `isUpperCase`

Reports whether a string is already upper case and contains a cased letter.

## Import

```ts
import { isUpperCase } from "@sgx4u/string";
```

## Signature

```ts
function isUpperCase(value: unknown): boolean;
```

## Examples

```ts
isUpperCase("ABC");
```

## Edge cases

An empty string and a digit string return `false`.
