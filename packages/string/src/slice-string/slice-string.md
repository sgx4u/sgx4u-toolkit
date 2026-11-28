# `sliceString`

Slices a string in graphemes, code points, or code units. Indexes match `String.prototype.slice`.

## Import

```ts
import { sliceString } from "@sgx4u/string";
```

## Signature

```ts
function sliceString(options: {
    value: string;
    start?: number;
    end?: number;
    unit?: "grapheme" | "codePoint" | "codeUnit";
}): string | undefined;
```

## Options

| Option  | Default      | Description                                                 |
| ------- | ------------ | ----------------------------------------------------------- |
| `value` |              | Text to slice. A non-string returns `undefined`.            |
| `start` | `0`          | Start index in `unit`. Negative indexes count from the end. |
| `end`   | the length   | Exclusive end index. Negative indexes count from the end.   |
| `unit`  | `"grapheme"` | `"grapheme"`, `"codePoint"`, or `"codeUnit"`.               |

## Examples

```ts
sliceString({ value: "hello", start: 1, end: 4 });
```

## Edge cases

Out-of-range indexes are clamped. A non-string returns `undefined`.
