# `insertString`

Inserts text at a unit index. The index is clamped like `slice`.

## Import

```ts
import { insertString } from "@sgx4u/string";
```

## Signature

```ts
function insertString(options: {
    value: string;
    index: number;
    insertion: string;
}): string | undefined;
```

## Options

| Option      | Default      | Description                                                                                   |
| ----------- | ------------ | --------------------------------------------------------------------------------------------- |
| `value`     |              | Text to edit. A non-string returns `undefined`.                                               |
| `index`     |              | Unit index. The length appends. Out of range is clamped. Negative indexes count from the end. |
| `insertion` |              | Text to insert.                                                                               |
| `unit`      | `"grapheme"` | `"grapheme"`, `"codePoint"`, or `"codeUnit"`.                                                 |

## Examples

```ts
insertString({ value: "ac", index: 1, insertion: "b" });
```

## Edge cases

An index equal to the length appends.
