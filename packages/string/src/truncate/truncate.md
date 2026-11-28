# `truncate`

Shortens a string to a maximum number of units and adds an omission. The default omission is the ellipsis. The cut never falls inside a unit. `separator` trims back to the last match when `location` is `end`.

## Import

```ts
import { truncate } from "@sgx4u/string";
```

## Signature

```ts
function truncate(options: {
    value: string;
    maximumLength: number;
    omission?: string;
    location?: "end" | "start" | "middle";
    unit?: "grapheme" | "codePoint" | "codeUnit";
    separator?: string | RegExp;
}): string | undefined;
```

## Options

| Option          | Default      | Description                                                                                                |
| --------------- | ------------ | ---------------------------------------------------------------------------------------------------------- |
| `value`         |              | Text to shorten. A non-string returns `undefined`.                                                         |
| `maximumLength` |              | Maximum length of the result, in `unit`. The omission counts.                                              |
| `omission`      | `\u2026`     | Text that marks the cut.                                                                                   |
| `location`      | `"end"`      | `"end"`, `"start"`, or `"middle"`.                                                                         |
| `unit`          | `"grapheme"` | `"grapheme"`, `"codePoint"`, or `"codeUnit"`.                                                              |
| `separator`     |              | When `location` is `"end"`, trim back to the last match. A string is literal. A `RegExp` uses its pattern. |

## Examples

```ts
truncate({ value: "hello world", maximumLength: 8 });
```

## Edge cases

If the omission is longer than `maximumLength`, a unit-sliced omission is returned, or `""` when nothing fits. A negative `maximumLength`, an unknown `location`, or an unknown `unit` throws `RangeError`. `separator` is used only when `location` is `"end"`. The cut never falls inside a grapheme when `unit` is `"grapheme"`.
