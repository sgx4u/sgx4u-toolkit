# `countSentences`

Counts sentences with the same split as `splitSentences`.

## Import

```ts
import { countSentences } from "@sgx4u/string";
```

## Signature

```ts
function countSentences(value: string): number | undefined;
```

## Options

| Option   | Default            | Description                                    |
| -------- | ------------------ | ---------------------------------------------- |
| `value`  |                    | Text to count. A bare string is also accepted. |
| `locale` | the runtime locale | Locale passed to the sentence segmenter.       |

## Examples

```ts
countSentences("Hello. World.");
```

## Edge cases

An empty string returns 0.
