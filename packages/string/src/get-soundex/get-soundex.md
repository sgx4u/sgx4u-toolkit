# `getSoundex`

Returns a four-character English Soundex code, padded with zeros. `Robert` and `Rupert` are `R163`. `Ashcraft` is `A261`. Digits and other non-letters are ignored, so a string of digits has nothing to encode.

## Import

```ts
import { getSoundex } from "@sgx4u/string";
```

## Signature

```ts
function getSoundex(value: unknown): string | undefined;
```

## Examples

```ts
getSoundex("Robert");
```

## Edge cases

A string with no letters returns `undefined`.
