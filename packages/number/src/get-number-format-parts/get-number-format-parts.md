# `getNumberFormatParts`

Returns the `Intl.NumberFormatPart` list for a finite number.

## Import

```ts
import { getNumberFormatParts } from "@sgx4u/number";
```

## Signature

```ts
function getNumberFormatParts(parameters: {
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
}): Intl.NumberFormatPart[] | undefined;
```

## Examples

```ts
getNumberFormatParts({ value: 1.5, locale: "en-US" });
```

## Edge cases

- Invalid input returns `undefined` or `false`, and does not throw, unless this guide says otherwise.

## Related

- `formatNumber`
- `getLocaleNumberSymbols`
