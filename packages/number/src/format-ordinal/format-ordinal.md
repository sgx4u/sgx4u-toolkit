# `formatOrdinal`

Formats the integer part of a finite number as an ordinal. English uses st, nd, rd, and th. French uses er and e. German uses a trailing period. Other locales return the formatted integer.

## Import

```ts
import { formatOrdinal } from "@sgx4u/number";
```

## Signature

```ts
function formatOrdinal(parameters: {
    value: number;
    locale?: string | readonly string[];
}): string | undefined;
```

## Examples

```ts
formatOrdinal({ value: 1, locale: "en-US" });
```

## Edge cases

- First-class ordinal text: English, French, and German. Japanese and Arabic return the formatted integer.

## Related

- `formatNumber`
