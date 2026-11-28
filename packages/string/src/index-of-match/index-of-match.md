# `indexOfMatch`

Returns the unit index of a search string, or -1. A non-string returns `undefined`, not -1.

## Import

```ts
import { indexOfMatch } from "@sgx4u/string";
```

## Signature

```ts
function indexOfMatch(options: {
    value: string;
    search: string;
    fromIndex?: number;
}): number | undefined;
```

## Options

| Option       | Default            | Description                                                 |
| ------------ | ------------------ | ----------------------------------------------------------- |
| `value`      |                    | Text to search. A non-string returns `undefined`, not `-1`. |
| `search`     |                    | Text to find. An empty search matches at `fromIndex`.       |
| `fromIndex`  | `0`                | Start index in `unit`. A negative index is clamped to 0.    |
| `unit`       | `"grapheme"`       | `"grapheme"`, `"codePoint"`, or `"codeUnit"`.               |
| `ignoreCase` | `false`            | Ignore case and keep accents.                               |
| `locale`     | the runtime locale | Locale for the collator and grapheme boundaries.            |

## Examples

```ts
indexOfMatch({ value: "hello", search: "ll" });
```

## Edge cases

A non-string is `undefined` so a bad input is not confused with not found.
