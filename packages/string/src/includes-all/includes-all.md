# `includesAll`

Reports whether a string contains every search string.

## Import

```ts
import { includesAll } from "@sgx4u/string";
```

## Signature

```ts
function includesAll(options: {
    value: string;
    searches: readonly string[];
}): boolean;
```

## Options

| Option       | Default            | Description                                                                                       |
| ------------ | ------------------ | ------------------------------------------------------------------------------------------------- |
| `value`      |                    | Text to test. A non-string returns `false`.                                                       |
| `searches`   |                    | Strings that must all occur. An empty list returns `true`. A non-string entry throws `TypeError`. |
| `ignoreCase` | `false`            | Passed through to each search.                                                                    |
| `locale`     | the runtime locale | Locale used when `ignoreCase` is true.                                                            |

## Examples

```ts
includesAll({ value: "hello", searches: ["he", "lo"] });
```

## Edge cases

A non-string search throws `TypeError`.
