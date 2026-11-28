# `includes`

Reports whether a string contains a search string.

## Import

```ts
import { includes } from "@sgx4u/string";
```

## Signature

```ts
function includes(options: {
    value: string;
    search: string;
    ignoreCase?: boolean;
}): boolean;
```

## Options

| Option       | Default            | Description                                 |
| ------------ | ------------------ | ------------------------------------------- |
| `value`      |                    | Text to test. A non-string returns `false`. |
| `search`     |                    | Literal substring to find.                  |
| `ignoreCase` | `false`            | Compare with locale lowercasing.            |
| `locale`     | the runtime locale | Locale used when `ignoreCase` is true.      |

## Examples

```ts
includes({ value: "hello", search: "ell" });
```

## Edge cases

A non-string returns `false`.
