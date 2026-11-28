# `formatNumber`

Formats a finite number with `Intl.NumberFormat`. A non-finite value returns `undefined` and is not printed as `NaN` or infinity.

## Import

```ts
import { formatNumber } from "@sgx4u/number";
```

## Signature

```ts
function formatNumber(parameters: {
    value: number;
    locale?: string | readonly string[];
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    minimumSignificantDigits?: number;
    maximumSignificantDigits?: number;
    useGrouping?: UseGrouping;
    numberingSystem?: string;
    roundingMode?: RoundingMode;
    signDisplay?: SignDisplay;
    trailingZeroDisplay?: TrailingZeroDisplay;
    notation?: NumberNotation;
    compactDisplay?: CompactDisplay;
}): string | undefined;
```

## Examples

```ts
formatNumber({ value: 1234.5, locale: "en-US" });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `formatCurrency`
- `parseLocaleNumber`
