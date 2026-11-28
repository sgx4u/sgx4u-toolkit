# `atString`

Returns one grapheme, code point, or code unit. A negative index counts from the end. Out of range returns `undefined`.

## Import

```ts
import { atString } from "@sgx4u/string";
```

## Signature

```ts
function atString(options: {
    value: string;
    index: number;
}): string | undefined;
```

## Options

| Option  | Default      | Description                                                                        |
| ------- | ------------ | ---------------------------------------------------------------------------------- |
| `value` |              | Text to index. A non-string returns `undefined`.                                   |
| `index` |              | Unit index. Negative indexes count from the end. Out of range returns `undefined`. |
| `unit`  | `"grapheme"` | `"grapheme"`, `"codePoint"`, or `"codeUnit"`.                                      |

## Examples

```ts
atString({ value: "hi", index: 0 });
```

## Edge cases

A non-string returns `undefined`, not an empty string.
