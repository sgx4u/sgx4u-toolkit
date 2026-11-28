# `transliterate`

Maps letters from Latin, Greek, Cyrillic, Arabic, Hebrew, and a compact Devanagari set toward ASCII. A `de` locale spells ä ö ü ß as `ae`, `oe`, `ue`, and `ss`. Other scripts are left unchanged.

## Import

```ts
import { transliterate } from "@sgx4u/string/transliterate";
```

## Signature

```ts
function transliterate(value: string): string | undefined;
```

## Examples

```ts
transliterate("Привет"); // "Privet"
```

## Edge cases

A non-string returns `undefined`. Characters outside the shipped tables are kept.
