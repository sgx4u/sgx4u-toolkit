# `parseLocaleNumber`

Parses a locale-formatted number, including grouping separators such as Indian `12,34,567.89` and German `1.234,56`.

## Import

```ts
import { parseLocaleNumber } from "@sgx4u/number";
```

## Signature

```ts
function parseLocaleNumber(parameters: {
    value: string;
    locale?: string | readonly string[];
}): number | undefined;
```

## Examples

```ts
parseLocaleNumber({ value: "1.234,56", locale: "de-DE" });
```

## Edge cases

- An invalid locale throws `RangeError`.
- Percent signs are rejected. Use `parsePercent`.

## Related

- `parseNumber`
- `parsePercent`
- `parseCurrency`
