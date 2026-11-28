# `wrapText`

Wraps text onto lines using display width. A grapheme wider than the line sits on its own line.

## Import

```ts
import { wrapText } from "@sgx4u/string";
```

## Signature

```ts
function wrapText(options: {
    value: string;
    maximumWidth: number;
    breakLongWords?: boolean;
    newline?: string;
    indent?: string;
}): string | undefined;
```

## Options

| Option           | Default | Description                                                                 |
| ---------------- | ------- | --------------------------------------------------------------------------- |
| `value`          |         | Text to wrap. A non-string returns `undefined`.                             |
| `maximumWidth`   |         | Display columns available for the line content after `indent`.              |
| `breakLongWords` | `true`  | Split a word that is wider than the line. A single grapheme is never split. |
| `newline`        | `\n`    | Separator between wrapped lines.                                            |
| `indent`         | `""`    | Prefix on every line, including the first.                                  |

## Examples

```ts
wrapText({ value: "hello world", maximumWidth: 8 });
```

## Edge cases

`maximumWidth` less than 1 throws `RangeError`.
