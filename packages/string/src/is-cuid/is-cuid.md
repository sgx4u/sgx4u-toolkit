# `isCUID`

Reports whether a string is a CUID v1: `c` followed by 24 lowercase letters or digits.

## Import

```ts
import { isCUID } from "@sgx4u/string";
```

## Signature

```ts
function isCUID(value: unknown): boolean;
```

## Examples

```ts
isCUID("value");
```

## Edge cases

A non-string returns `false`.
