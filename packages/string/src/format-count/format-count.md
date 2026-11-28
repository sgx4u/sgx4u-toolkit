# `formatCount`

Formats a count and an English noun, such as `1 apple` or `2 apples`.

## Import

```ts
import { formatCount } from "@sgx4u/string";
```

## Signature

```ts
function formatCount(options: {
    value: string;
    count: number;
    locale?: string;
}): string | undefined;
```

## Examples

```ts
formatCount({ value: "apple", count: 2 });
```

## Edge cases

The number is formatted with `Intl.NumberFormat`.
