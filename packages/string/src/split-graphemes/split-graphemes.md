# `splitGraphemes`

Splits a string into grapheme clusters. Emoji sequences and combining marks stay in one element.

## Import

```ts
import { splitGraphemes } from "@sgx4u/string";
```

## Signature

```ts
function splitGraphemes(value: unknown): string[] | undefined;
```

## Examples

```ts
splitGraphemes("a😀");
```

## Edge cases

An empty string returns an empty array. A non-string returns `undefined`.
