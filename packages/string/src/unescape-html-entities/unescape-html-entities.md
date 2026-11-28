# `unescapeHTMLEntities`

Decodes HTML5 named entities and numeric character references. A name may omit the semicolon when the HTML specification allows that.

## Import

```ts
import { unescapeHTMLEntities } from "@sgx4u/string/html-entities";
```

## Signature

```ts
function unescapeHTMLEntities(value: unknown): string | undefined;
```

## Examples

```ts
unescapeHTMLEntities("&amp;"); // "&"
```

## Edge cases

An unrecognized reference is left in place. A non-string returns `undefined`.
