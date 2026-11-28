# `take`

Returns part of a string measured in graphemes by default. A count of 0 returns an empty string.

## Import

```ts
import { take } from "@sgx4u/string";
```

## Signature

```ts
function take(options: { value: string; count: number }): string | undefined;
```

## Options

| Option  | Default      | Description                                              |
| ------- | ------------ | -------------------------------------------------------- |
| `value` |              | Text to read. A non-string returns `undefined`.          |
| `count` |              | How many units to keep from the start. `0` returns `""`. |
| `unit`  | `"grapheme"` | `"grapheme"`, `"codePoint"`, or `"codeUnit"`.            |

## Examples

```ts
take({ value: "hello", count: 2 });
```

## Edge cases

A negative count throws `RangeError`.
