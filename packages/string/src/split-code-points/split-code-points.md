# `splitCodePoints`

Splits a string into Unicode code points.

## Import

```ts
import { splitCodePoints } from "@sgx4u/string";
```

## Signature

```ts
function splitCodePoints(value: unknown): string[] | undefined;
```

## Examples

```ts
splitCodePoints("😀");
```

## Edge cases

A combining sequence is more than one code point. A non-string returns `undefined`.
