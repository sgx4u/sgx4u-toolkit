# `formatCompactNumber`

Formats a finite number in compact notation. `compactDisplay` defaults to `short`. Indian locales already use lakh and crore units.

## Import

```ts
import { formatCompactNumber } from "@sgx4u/number";
```

## Signature

```ts
function formatCompactNumber(parameters: {
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
formatCompactNumber({ value: 1200000, locale: "en-IN" });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `formatNumber`
