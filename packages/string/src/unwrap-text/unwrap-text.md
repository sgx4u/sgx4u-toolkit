# `unwrapText`

Joins wrapped lines. A newline between words becomes a space. A blank line stays a paragraph break.

## Import

```ts
import { unwrapText } from "@sgx4u/string";
```

## Signature

```ts
function unwrapText(value: unknown): string | undefined;
```

## Options

| Argument | Description                                     |
| -------- | ----------------------------------------------- |
| `value`  | Wrapped text. A non-string returns `undefined`. |

## Examples

```ts
unwrapText("hello\nworld");
```

## Edge cases

A non-string returns `undefined`.
