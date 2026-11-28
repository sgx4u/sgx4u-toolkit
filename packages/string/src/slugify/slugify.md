# `slugify`

Builds a slug. Diacritics are removed, runs of non-letters become the separator, and Unicode letters such as Hindi and CJK stay. Full script transliteration is on `@sgx4u/string/transliterate`.

## Import

```ts
import { slugify } from "@sgx4u/string";
```

## Signature

```ts
function slugify(value: string): string | undefined;
```

## Examples

```ts
slugify("Hello, World!");
```

## Edge cases

An empty separator throws `RangeError`. The result is idempotent.
