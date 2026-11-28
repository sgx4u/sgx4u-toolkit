# `reverseString`

Reverses a string without splitting a grapheme.

## Import

```ts
import { reverseString } from "@sgx4u/string";
```

## Signature

```ts
function reverseString(value: string): string | undefined;
```

## Options

| Option  | Default      | Description                                      |
| ------- | ------------ | ------------------------------------------------ |
| `value` |              | Text to reverse. A bare string is also accepted. |
| `unit`  | `"grapheme"` | `"grapheme"`, `"codePoint"`, or `"codeUnit"`.    |

## Examples

```ts
reverseString("ab");
```

## Edge cases

A non-string returns `undefined`.
