# `replaceRange`

Replaces a unit range. `start` after `end` throws `RangeError`.

## Import

```ts
import { replaceRange } from "@sgx4u/string";
```

## Signature

```ts
function replaceRange(options: {
    value: string;
    start: number;
    end: number;
    replacement: string;
}): string | undefined;
```

## Options

| Option        | Default      | Description                                                   |
| ------------- | ------------ | ------------------------------------------------------------- |
| `value`       |              | Text to edit. A non-string returns `undefined`.               |
| `start`       |              | Start index in `unit`. Negative indexes count from the end.   |
| `end`         |              | Exclusive end index. `start` after `end` throws `RangeError`. |
| `replacement` |              | Text that replaces the range.                                 |
| `unit`        | `"grapheme"` | `"grapheme"`, `"codePoint"`, or `"codeUnit"`.                 |

## Examples

```ts
replaceRange({ value: "abcd", start: 1, end: 3, replacement: "X" });
```

## Edge cases

Negative indexes count from the end.
