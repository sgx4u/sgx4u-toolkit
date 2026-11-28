# `formatUnit`

Formats a finite number with an `Intl` unit.

## Import

```ts
import { formatUnit } from "@sgx4u/number";
```

## Signature

```ts
function formatUnit(parameters: {
    value: number;
    unit: string;
    locale?: string | readonly string[];
    unitDisplay?: UnitDisplay;
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
formatUnit({ value: 3, unit: "kilometer", locale: "en-US" });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `formatNumber`
- `formatBytes`
