# `isULID`

Reports whether a string is 26 Crockford base32 characters. The alphabet omits I, L, O, and U.

## Import

```ts
import { isULID } from "@sgx4u/string";
```

## Signature

```ts
function isULID(value: unknown): boolean;
```

## Examples

```ts
isULID("value");
```

## Edge cases

A non-string returns `false`.
