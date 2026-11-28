# `takeLast`

Returns part of a string measured in graphemes by default. A count of 0 returns an empty string.

## Import

```ts
import { takeLast } from "@sgx4u/string";
```

## Signature

```ts
function takeLast(options: {
    value: string;
    count: number;
}): string | undefined;
```

## Options

| Option  | Default      | Description                                            |
| ------- | ------------ | ------------------------------------------------------ |
| `value` |              | Text to read. A non-string returns `undefined`.        |
| `count` |              | How many units to keep from the end. `0` returns `""`. |
| `unit`  | `"grapheme"` | `"grapheme"`, `"codePoint"`, or `"codeUnit"`.          |

## Examples

```ts
takeLast({ value: "hello", count: 2 });
```

## Edge cases

A negative count throws `RangeError`.
