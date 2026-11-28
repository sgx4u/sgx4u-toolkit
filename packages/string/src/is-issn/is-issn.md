# `isISSN`

Reports whether a string is an ISSN with a valid checksum.

## Import

```ts
import { isISSN } from "@sgx4u/string";
```

## Signature

```ts
function isISSN(value: unknown): boolean;
```

## Examples

```ts
isISSN("value");
```

## Edge cases

A non-string returns `false`.
