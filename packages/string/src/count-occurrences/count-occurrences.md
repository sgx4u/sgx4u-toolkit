# `countOccurrences`

Counts occurrences of a search string. An empty search returns 0. `overlap` lets matches share characters.

## Import

```ts
import { countOccurrences } from "@sgx4u/string";
```

## Signature

```ts
function countOccurrences(options: {
    value: string;
    search: string;
    overlap?: boolean;
}): number | undefined;
```

## Options

| Option       | Default            | Description                                                      |
| ------------ | ------------------ | ---------------------------------------------------------------- |
| `value`      |                    | Text to scan. A non-string returns `undefined`.                  |
| `search`     |                    | Text to count. An empty search returns `0`.                      |
| `overlap`    | `false`            | When true, the next search starts one character after the match. |
| `ignoreCase` | `false`            | Compare with locale lowercasing.                                 |
| `locale`     | the runtime locale | Locale used when `ignoreCase` is true.                           |

## Examples

```ts
countOccurrences({ value: "aaa", search: "aa", overlap: true });
```

## Edge cases

An empty `search` returns `0`. It is not treated as a match between every character. A non-string returns `undefined`.
