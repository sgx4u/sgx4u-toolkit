# `formatPercent`

Formats a ratio as a percent. `0.25` is 25 percent. This is the opposite direction from {@link parsePercent}.

## Import

```ts
import { formatPercent } from "@sgx4u/number";
```

## Signature

```ts
function formatPercent(parameters: {
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
formatPercent({ value: 0.25, locale: "en-US" });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `parsePercent`
- `formatNumber`
