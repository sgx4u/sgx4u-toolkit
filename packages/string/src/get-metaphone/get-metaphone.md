# `getMetaphone`

Returns an English Metaphone code from the published 1990 rule summary. This implementation encodes `Robert` as `RBRT`, `Rupert` as `RPRT`, and `Smith` as `SM0`.

## Import

```ts
import { getMetaphone } from "@sgx4u/string";
```

## Signature

```ts
function getMetaphone(value: unknown): string | undefined;
```

## Examples

```ts
getMetaphone("Robert"); // "RBRT"
getMetaphone("Rupert"); // "RPRT"
getMetaphone("Smith"); // "SM0"
```

## Edge cases

A string with no letters returns `undefined`.
