# `getDoubleMetaphone`

Returns a primary and secondary phonetic code. `Smith` is `SM0` / `XMT` and `Schmidt` is `XMT` / `SMT`, so the codes overlap.

## Import

```ts
import { getDoubleMetaphone } from "@sgx4u/string";
```

## Signature

```ts
function getDoubleMetaphone(
    value: unknown,
): { primary: string; secondary: string } | undefined;
```

## Examples

```ts
getDoubleMetaphone("Smith");
```

## Edge cases

When there is no alternate pronunciation, `secondary` equals `primary`.
