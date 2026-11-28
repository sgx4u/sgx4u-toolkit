# `unescapeHTML`

Decodes the five HTML escapes from `escapeHTML`, plus decimal and hexadecimal character references. Other named entities are left unchanged.

## Import

```ts
import { unescapeHTML } from "@sgx4u/string";
```

## Signature

```ts
function unescapeHTML(value: unknown): string | undefined;
```

## Examples

```ts
unescapeHTML("&amp;");
```

## Edge cases

`&nbsp;` is left unchanged. Use `@sgx4u/string/html-entities` for named entities.
