# `quoteString`

Wraps a string in quotes and escapes that quote and backslashes.

## Import

```ts
import { quoteString } from "@sgx4u/string";
```

## Signature

```ts
function quoteString(value: string): string | undefined;
function quoteString(options: {
    value: string;
    style?: "double" | "single" | "backtick";
}): string | undefined;
```

## Options

| Option  | Default    | Description                                      |
| ------- | ---------- | ------------------------------------------------ |
| `value` |            | Text to quote. A non-string returns `undefined`. |
| `style` | `"double"` | `"double"`, `"single"`, or `"backtick"`.         |

## Examples

```ts
quoteString({ value: "a" });
```

## Edge cases

An unknown style throws `RangeError`.
