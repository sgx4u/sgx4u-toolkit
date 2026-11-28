# `truncateToDisplayWidth`

Shortens a string to a display-column budget. Wide characters count as 2. The default omission is the ellipsis.

## Import

```ts
import { truncateToDisplayWidth } from "@sgx4u/string";
```

## Signature

```ts
function truncateToDisplayWidth(options: {
    value: string;
    maximumWidth: number;
    omission?: string;
    location?: "end" | "start" | "middle";
}): string | undefined;
```

## Options

| Option         | Default  | Description                                        |
| -------------- | -------- | -------------------------------------------------- |
| `value`        |          | Text to shorten. A non-string returns `undefined`. |
| `maximumWidth` |          | Maximum display columns, including the omission.   |
| `omission`     | `\u2026` | Text that marks the cut. Its display width counts. |
| `location`     | `"end"`  | `"end"`, `"start"`, or `"middle"`.                 |

## Examples

```ts
truncateToDisplayWidth({ value: "hello", maximumWidth: 4 });
```

## Edge cases

A negative `maximumWidth` throws `RangeError`. A grapheme is never split. When one grapheme is wider than `maximumWidth`, it is left out: an empty omission returns `""`, and a wider omission returns the longest prefix of the omission that fits. The result's display width does not exceed `maximumWidth` when that is possible.
