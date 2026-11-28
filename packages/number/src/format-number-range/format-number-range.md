# `formatNumberRange`

Formats a finite numeric range. Uses `Intl.NumberFormat.formatRange` when it exists, otherwise joins the two formatted numbers with an en dash.

## Import

```ts
import { formatNumberRange } from "@sgx4u/number";
```

## Signature

```ts
function formatNumberRange(parameters: {
    start: number;
    end: number;
    locale?: string | readonly string[];
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    useGrouping?: UseGrouping;
    numberingSystem?: string;
    roundingMode?: RoundingMode;
    signDisplay?: SignDisplay;
}): string | undefined;
```

## Examples

```ts
formatNumberRange({ start: 1, end: 2, locale: "en-US" });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `formatNumber`
