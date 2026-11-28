# `escapeMarkdown`

Escapes ASCII punctuation that CommonMark treats as markup, so the text renders literally.

## Import

```ts
import { escapeMarkdown } from "@sgx4u/string";
```

## Signature

```ts
function escapeMarkdown(value: unknown): string | undefined;
```

## Examples

```ts
escapeMarkdown("*hi*");
```

## Edge cases

Letters and digits are left unchanged.
