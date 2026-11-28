# `splitLines`

Splits on `\n`, `\r\n`, and `\r` without keeping the separators.

## Import

```ts
import { splitLines } from "@sgx4u/string";
```

## Signature

```ts
function splitLines(value: string): string[] | undefined;
```

## Options

| Option      | Default | Description                                                                      |
| ----------- | ------- | -------------------------------------------------------------------------------- |
| `value`     |         | Text to split. A bare string is also accepted. A non-string returns `undefined`. |
| `omitEmpty` | `false` | Drop lines whose length is 0. A line of spaces is kept.                          |

## Examples

```ts
splitLines("a\nb");
```

## Edge cases

`omitEmpty` drops empty lines. A non-string returns `undefined`.
