# `truncateToBytes`

Shortens a string so its UTF-8 size stays within `maximumBytes`. A code point is never split.

## Import

```ts
import { truncateToBytes } from "@sgx4u/string";
```

## Signature

```ts
function truncateToBytes(options: {
    value: string;
    maximumBytes: number;
    omission?: string;
}): string | undefined;
```

## Options

| Option         | Default  | Description                                               |
| -------------- | -------- | --------------------------------------------------------- |
| `value`        |          | Text to shorten. A non-string returns `undefined`.        |
| `maximumBytes` |          | Maximum UTF-8 size of the result, including the omission. |
| `omission`     | `\u2026` | Text that marks the cut, measured in UTF-8 bytes.         |

## Examples

```ts
truncateToBytes({ value: "hello", maximumBytes: 4 });
```

## Edge cases

A negative `maximumBytes` throws `RangeError`. A code point is never split. A grapheme is kept whole when it fits in the remaining bytes. When it does not, code points from that grapheme are kept while they fit. The omission is counted in UTF-8 bytes. If the omission is longer than `maximumBytes`, a prefix of the omission that fits is returned.
