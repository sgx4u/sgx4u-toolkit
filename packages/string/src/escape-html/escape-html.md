# `escapeHTML`

Escapes `&`, `<`, `>`, `"`, and `'` to named or numeric entities. This is not an HTML sanitizer. Attribute values should still be quoted.

## Import

```ts
import { escapeHTML } from "@sgx4u/string";
```

## Signature

```ts
function escapeHTML(value: unknown): string | undefined;
```

## Examples

```ts
escapeHTML("<b>");
```

## Edge cases

A non-string returns `undefined`.
