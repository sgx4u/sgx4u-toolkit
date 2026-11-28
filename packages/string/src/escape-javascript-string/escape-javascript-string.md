# `escapeJavaScriptString`

Escapes a string for inclusion in a JavaScript or JSON string. The result is the literal body, without surrounding quotes.

## Import

```ts
import { escapeJavaScriptString } from "@sgx4u/string";
```

## Signature

```ts
function escapeJavaScriptString(value: unknown): string | undefined;
```

## Examples

```ts
escapeJavaScriptString('a"b');
```

## Edge cases

Line separators U+2028 and U+2029 are written as unicode escapes.
