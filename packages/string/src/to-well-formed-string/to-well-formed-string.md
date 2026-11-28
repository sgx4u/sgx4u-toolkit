# `toWellFormedString`

Returns a well-formed copy of a string, replacing lone surrogates.

## Import

```ts
import { toWellFormedString } from "@sgx4u/string";
```

## Signature

```ts
function toWellFormedString(value: unknown): string | undefined;
```

## Examples

```ts
toWellFormedString("ok");
```

## Edge cases

A lone surrogate is replaced. A non-string returns `undefined`.
