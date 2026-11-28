# `splitSentences`

Splits text into trimmed sentences with `Intl.Segmenter`.

## Import

```ts
import { splitSentences } from "@sgx4u/string";
```

## Signature

```ts
function splitSentences(value: string): string[] | undefined;
```

## Options

| Option   | Default            | Description                                    |
| -------- | ------------------ | ---------------------------------------------- |
| `value`  |                    | Text to split. A bare string is also accepted. |
| `locale` | the runtime locale | Locale passed to `Intl.Segmenter`.             |

## Examples

```ts
splitSentences("Hello. World.");
```

## Edge cases

An empty string returns `[]`.
