# `formatCurrency`

Formats a finite amount as currency. `currency` is required on the call or on a `createNumber` instance.

## Import

```ts
import { formatCurrency } from "@sgx4u/number";
```

## Signature

```ts
function formatCurrency(parameters: {
    value: number;\n    currency: string;\n    currencyDisplay?: CurrencyDisplay;\n    currencySign?: CurrencySign;
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
formatCurrency({ value: 12, currency: "USD", locale: "en-US" });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `formatNumber`
- `parseCurrency`
- `getCurrencySymbol`
