# `formatList`

Formats a list with `Intl.ListFormat`. An empty list returns an empty string.

## Import

```ts
import { formatList } from "@sgx4u/string";
```

## Signature

```ts
function formatList(options: {
    values: readonly string[];
    locale?: string;
    type?: "conjunction" | "disjunction" | "unit";
    style?: "long" | "short" | "narrow";
}): string | undefined;
```

## Options

| Option   | Default            | Description                                                                              |
| -------- | ------------------ | ---------------------------------------------------------------------------------------- |
| `values` |                    | Strings to format. An empty array returns `""`. A non-string element throws `TypeError`. |
| `locale` | the runtime locale | Locale passed to `Intl.ListFormat`.                                                      |
| `type`   | `"conjunction"`    | `"conjunction"`, `"disjunction"`, or `"unit"`.                                           |
| `style`  | `"long"`           | `"long"`, `"short"`, or `"narrow"`.                                                      |

## Examples

```ts
formatList({ values: ["a", "b"] });
```

## Edge cases

A non-string element throws `TypeError`.
