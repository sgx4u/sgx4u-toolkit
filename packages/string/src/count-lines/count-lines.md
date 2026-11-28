# `countLines`

Counts lines with the same split as `splitLines`.

## Import

```ts
import { countLines } from "@sgx4u/string";
```

## Signature

```ts
function countLines(value: string): number | undefined;
```

## Options

| Option      | Default | Description                                    |
| ----------- | ------- | ---------------------------------------------- |
| `value`     |         | Text to count. A bare string is also accepted. |
| `omitEmpty` | `false` | Drop empty lines before counting.              |

## Examples

```ts
countLines("a\nb");
```

## Edge cases

`omitEmpty` drops empty lines before counting.
