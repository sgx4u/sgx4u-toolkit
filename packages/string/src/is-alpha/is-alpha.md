# `isAlpha`

Reports whether every grapheme is a letter. A grapheme must contain a letter and otherwise only letters and marks of the allowed script. `locale: "ascii"` allows only `A-Z` and `a-z`. Latin languages, including `en`, `de`, `fr`, `es`, `pt`, `it`, `nl`, `tr`, and `pl`, allow Latin letters. `el` is Greek, `ru`/`uk`/`bg` are Cyrillic, `ar`/`fa` are Arabic, `he` is Hebrew, `hi`/`mr` are Devanagari, `th` is Thai, `zh` is Han, `ja` is Han plus hiragana and katakana, and `ko` is Hangul. An unknown tag allows any Unicode letter plus marks, the same fallback `Intl` uses. An omitted locale does the same.

## Import

```ts
import { isAlpha } from "@sgx4u/string";
```

## Signature

```ts
function isAlpha(value: unknown): boolean;
function isAlpha(options: { value: string; locale?: string }): boolean;
```

## Examples

```ts
isAlpha("Héllo");
```

## Edge cases

An empty string returns `false`. A non-string `locale` throws `TypeError`.
