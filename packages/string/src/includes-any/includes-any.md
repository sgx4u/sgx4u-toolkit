# `includesAny`

Reports whether a string contains any of the search strings.

## Import

```ts
import { includesAny } from "@sgx4u/string";
```

## Signature

```ts
function includesAny(options: {
    value: string;
    searches: readonly string[];
}): boolean;
```

## Options

| Option       | Default            | Description                                                                           |
| ------------ | ------------------ | ------------------------------------------------------------------------------------- |
| `value`      |                    | Text to test. A non-string returns `false`.                                           |
| `searches`   |                    | Strings to try. An empty list returns `false`. A non-string entry throws `TypeError`. |
| `ignoreCase` | `false`            | Passed through to each search.                                                        |
| `locale`     | the runtime locale | Locale used when `ignoreCase` is true.                                                |

## Examples

```ts
includesAny({ value: "hello", searches: ["x", "ell"] });
```

## Edge cases

An empty search list returns `false`.
