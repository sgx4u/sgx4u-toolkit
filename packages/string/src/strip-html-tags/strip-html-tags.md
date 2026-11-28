# `stripHTMLTags`

Removes HTML tags with a linear scan. This is not a sanitizer. Text inside a script tag is kept. Use a dedicated HTML sanitizer when untrusted HTML must be rendered.

## Import

```ts
import { stripHTMLTags } from "@sgx4u/string";
```

## Signature

```ts
function stripHTMLTags(value: string): string | undefined;
```

## Examples

```ts
stripHTMLTags("<b>hi</b>");
```

## Edge cases

`allowedTags` keeps those tags. Comments are removed.
