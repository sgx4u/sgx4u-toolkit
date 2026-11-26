# `getMonthNames`

Returns the 12 month names, January first.

## Import

```ts
import { getMonthNames } from "@sgx4u/date-time";
```

## Signature

```ts
function getMonthNames(options?: MonthNameOptions): string[];
```

## Options

| Name      | Type                            | Default                      | Meaning                                                                      |
| --------- | ------------------------------- | ---------------------------- | ---------------------------------------------------------------------------- |
| `locale`  | `string \| readonly string[]`   | The runtime's default locale | A BCP 47 language tag, or a list of tags in preference order.                |
| `width`   | `"long" \| "short" \| "narrow"` | `"long"`                     | The name length.                                                             |
| `context` | `"format" \| "standalone"`      | `"standalone"`               | `"format"` is the name used inside a date. `"standalone"` is the name alone. |

## Examples

```ts
import { getMonthNames } from "@sgx4u/date-time";

getMonthNames({ locale: "en-US" })[0];
// "January"

getMonthNames({ locale: "en-US", width: "short" })[0];
// "Jan"

getMonthNames({ locale: "de" })[0];
// "Januar"

getMonthNames({ locale: "en-US" }).length;
// 12
```

## Edge cases

The names come from the runtime for a fixed UTC reference year, so the result does not depend on the system zone. An unknown `width` throws a `RangeError`. The array always has 12 names when the call succeeds.

## Related

- [`getWeekdayNames`](../get-weekday-names/get-weekday-names.md)
- [`getLocaleDatePattern`](../get-locale-date-pattern/get-locale-date-pattern.md)
- [`getQuarter`](../get-quarter/get-quarter.md)
