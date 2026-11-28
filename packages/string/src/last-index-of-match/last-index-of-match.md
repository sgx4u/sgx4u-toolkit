# `lastIndexOfMatch`

Returns the last unit index of a search string, or -1. A non-string returns `undefined`.

## Import

```ts
import { lastIndexOfMatch } from "@sgx4u/string";
```

## Signature

```ts
function lastIndexOfMatch(options: {
    value: string;
    search: string;
}): number | undefined;
```

## Options

| Option       | Default            | Description                                                      |
| ------------ | ------------------ | ---------------------------------------------------------------- |
| `value`      |                    | Text to search. A non-string returns `undefined`, not `-1`.      |
| `search`     |                    | Text to find. An empty search matches at `fromIndex`.            |
| `fromIndex`  | the length         | Highest start index to accept. A negative index is clamped to 0. |
| `unit`       | `"grapheme"`       | `"grapheme"`, `"codePoint"`, or `"codeUnit"`.                    |
| `ignoreCase` | `false`            | Ignore case and keep accents.                                    |
| `locale`     | the runtime locale | Locale for the collator and grapheme boundaries.                 |

## Examples

```ts
lastIndexOfMatch({ value: "ababa", search: "ba" });
```

## Edge cases

A non-string returns `undefined`, not -1.
