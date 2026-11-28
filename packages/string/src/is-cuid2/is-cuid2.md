# `isCUID2`

Reports whether a string is a CUID2. The default length is 24 and the first character is a letter.

## Import

```ts
import { isCUID2 } from "@sgx4u/string";
```

## Signature

```ts
function isCUID2(value: unknown): boolean;
```

## Examples

```ts
isCUID2("value");
```

## Edge cases

A non-string returns `false`.
