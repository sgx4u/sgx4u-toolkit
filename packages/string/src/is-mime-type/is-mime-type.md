# `isMimeType`

Reports whether a string is a MIME type/subtype with no spaces.

## Import

```ts
import { isMimeType } from "@sgx4u/string";
```

## Signature

```ts
function isMimeType(value: unknown): boolean;
```

## Examples

```ts
isMimeType("value");
```

## Edge cases

A non-string returns `false`.
