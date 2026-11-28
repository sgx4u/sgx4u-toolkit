# `getDisplayWidth`

Returns the monospaced columns a string occupies. Wide and fullwidth characters and emoji graphemes are 2. Ambiguous characters are 1. ANSI escapes are ignored unless `countAnsiEscapeCodes` is true.

## Import

```ts
import { getDisplayWidth } from "@sgx4u/string";
```

## Signature

```ts
function getDisplayWidth(options: {
    value: string;
    countAnsiEscapeCodes?: boolean;
}): number | undefined;
```

## Examples

```ts
getDisplayWidth({ value: "あ" });
```

## Edge cases

A tab is 0 columns. A halfwidth katakana character is 1.
