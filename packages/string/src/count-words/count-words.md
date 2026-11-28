# `countWords`

Counts words with the same rules as `splitWords`.

## Import

```ts
import { countWords } from "@sgx4u/string";
```

## Signature

```ts
function countWords(value: string): number | undefined;
```

## Options

| Option   | Default            | Description                                                                 |
| -------- | ------------------ | --------------------------------------------------------------------------- |
| `value`  |                    | Text to count. A bare string is also accepted. An empty string returns `0`. |
| `locale` | the runtime locale | Locale used for the same word split as `splitIntoWords`.                    |

## Examples

```ts
countWords("foo bar");
```

## Edge cases

An empty string returns 0.
