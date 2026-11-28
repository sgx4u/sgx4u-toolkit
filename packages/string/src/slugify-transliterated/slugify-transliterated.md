# `slugifyTransliterated`

Transliterates the text and then applies the same slug rules as `slugify`.

## Import

```ts
import { slugifyTransliterated } from "@sgx4u/string/transliterate";
```

## Signature

```ts
function slugifyTransliterated(value: string): string | undefined;
```

## Examples

```ts
slugifyTransliterated("Привет мир"); // "privet-mir"
```

## Edge cases

A `de` locale spells `Über` as `ueber`.
