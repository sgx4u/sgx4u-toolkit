# `getStringLength`

Counts a string in graphemes, code points, or UTF-16 code units. The default is graphemes.

## Import

```ts
import { getStringLength } from "@sgx4u/string";
```

## Signature

```ts
function getStringLength(options: {
    value: string;
    unit?: "grapheme" | "codePoint" | "codeUnit";
}): number | undefined;
```

## Examples

```ts
getStringLength({ value: "a😀" });
```

## Edge cases

A family emoji is one grapheme. An unknown `unit` throws `RangeError`.
