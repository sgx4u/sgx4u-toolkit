# `createNumber`

Returns a frozen set of the root number helpers with defaults bound in. A call can still override any bound field. Two instances do not share user-visible state. Word helpers stay on their locale subpaths.

## Import

```ts
import { createNumber } from "@sgx4u/number";
```

## Signature

```ts
function createNumber<Config extends NumberConfig = NumberConfig>(
    config?: Config,
): NumberInstance<Config>;
```

## Options

| Name                  | Type                                                          | Default              | Meaning                                                                             |
| --------------------- | ------------------------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------- |
| `locale`              | `string \| readonly string[]`                                 | Runtime locale       | Locale passed to `Intl` when a call omits `locale`.                                 |
| `currency`            | `string`                                                      | None                 | Currency used when a call omits `currency`.                                         |
| `currencyDisplay`     | `"symbol" \| "narrowSymbol" \| "code" \| "name"`              | `"symbol"`           | How a currency is shown.                                                            |
| `roundingMode`        | `RoundingMode`                                                | `"halfExpand"`       | Rounding mode when a call omits one.                                                |
| `useGrouping`         | `boolean \| "always" \| "min2" \| "auto"`                     | `"auto"`             | Digit grouping.                                                                     |
| `numberingSystem`     | `string`                                                      | Runtime default      | Numbering system passed to `Intl`.                                                  |
| `compactDisplay`      | `"short" \| "long"`                                           | `"short"`            | Compact suffix length.                                                              |
| `signDisplay`         | `"auto" \| "always" \| "exceptZero" \| "negative" \| "never"` | `"auto"`             | Which signs to show.                                                                |
| `trailingZeroDisplay` | `"auto" \| "stripIfInteger"`                                  | `"auto"`             | Trailing zeros on integers.                                                         |
| `byteStandard`        | `"SI" \| "IEC"`                                               | `"SI"`               | Byte scale for `formatBytes`. `parseBytes` keeps `"auto"` unless this field is set. |
| `random`              | `() => number`                                                | `Math.random`        | Float in `[0, 1)` for non-secure random helpers.                                    |
| `absoluteTolerance`   | `number`                                                      | `0`                  | Absolute difference that still counts as equal.                                     |
| `relativeTolerance`   | `number`                                                      | `Number.EPSILON * 8` | Relative difference that still counts as equal.                                     |
| `percentileMethod`    | `QuantileMethod`                                              | `"linear"`           | Method for percentiles, quantiles, and the instance quartiles.                      |

## Examples

```ts
const numbers = createNumber({
    locale: "en-IN",
    currency: "INR",
    roundingMode: "halfEven",
});
numbers.formatCurrency({ value: 100000 });
numbers.roundNumber({ value: 2.5 }); // 2
numbers.formatCurrency({ value: 1, currency: "USD" });
```

## Edge cases

- An invalid locale, currency, numbering system, or option throws `RangeError`.
- `random` must be a function. Anything else throws `TypeError`.
- `formatCurrency` throws when neither the call nor the config provides `currency`.
- The instance is frozen. There is no module-level mutable locale or generator.

## Related

- `formatCurrency`
- `roundNumber`
- `areAlmostEqual`
