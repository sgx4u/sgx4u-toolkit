# `equalsString`

Reports whether two strings are equal under `Intl.Collator`. The default sensitivity is `variant`.

## Import

```ts
import { equalsString } from "@sgx4u/string";
```

## Signature

```ts
function equalsString(options: {
    first: string;
    second: string;
    sensitivity?: "base" | "accent" | "case" | "variant";
}): boolean;
```

## Options

| Option        | Default            | Description                                      |
| ------------- | ------------------ | ------------------------------------------------ |
| `first`       |                    | Left-hand string. A non-string returns `false`.  |
| `second`      |                    | Right-hand string. A non-string returns `false`. |
| `sensitivity` | `"variant"`        | `"base"`, `"accent"`, `"case"`, or `"variant"`.  |
| `locale`      | the runtime locale | Locale passed to `Intl.Collator`.                |

## Examples

```ts
equalsString({ first: "a", second: "a" });
```

## Edge cases

A non-string returns `false`. An unknown sensitivity throws `RangeError`.
