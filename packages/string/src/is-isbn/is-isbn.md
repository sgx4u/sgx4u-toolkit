# `isISBN`

Reports whether a string is a valid ISBN-10 or ISBN-13.

## Import

```ts
import { isISBN } from "@sgx4u/string";
```

## Signature

```ts
function isISBN(value: unknown): boolean;
```

## Examples

```ts
isISBN("value");
```

## Edge cases

A non-string returns `false`.
