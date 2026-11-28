# `createTransliterate`

Returns `transliterate` and `slugifyTransliterated` with a config bound in. It does not read a root `createString` instance.

## Import

```ts
import { createTransliterate } from "@sgx4u/string/transliterate";
```

## Signature

```ts
function createTransliterate(config?: StringConfig): TransliterateLibrary;
```

## Examples

```ts
const text = createTransliterate({ locale: "de" });
text.slugifyTransliterated("Über"); // "ueber"
```

## Edge cases

An unknown config key throws `RangeError`.
