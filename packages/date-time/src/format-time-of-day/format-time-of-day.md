# `formatTimeOfDay`

Formats a time of day in a locale.

## Import

```ts
import { formatTimeOfDay } from "@sgx4u/date-time";
```

## Signature

```ts
function formatTimeOfDay(
    time: TimeOfDay,
    options?: FormatTimeOfDayOptions,
): string;
```

## Options

| Name        | Type                                    | Default        | Meaning                                                    |
| ----------- | --------------------------------------- | -------------- | ---------------------------------------------------------- |
| `locale`    | `string \| readonly string[]`           | Runtime locale | Locale for the clock text.                                 |
| `precision` | `"minute" \| "second" \| "millisecond"` | `"minute"`     | Which fields are shown.                                    |
| `hourCycle` | `"h12" \| "h23"`                        |                | 12-hour or 24-hour clock. Omitted uses the locale's cycle. |

## Examples

```ts
formatTimeOfDay(
    { hour: 15, minute: 30, second: 4, millisecond: 7 },
    { locale: "en-US", hourCycle: "h23" },
);
// "15:30"

formatTimeOfDay(
    { hour: 15, minute: 30, second: 4, millisecond: 7 },
    { locale: "en-US" },
);
// "3:30 PM"

formatTimeOfDay(
    { hour: 0, minute: 0, second: 0, millisecond: 0 },
    { locale: "en-US", hourCycle: "h12" },
);
// "12:00 AM"

formatTimeOfDay(
    { hour: 23, minute: 59, second: 59, millisecond: 7 },
    { locale: "en-US", hourCycle: "h23", precision: "millisecond" },
);
// "23:59:59.007"
```

## Edge cases

An unknown `precision` or hour cycle throws `RangeError`. A time that is not an object with a finite hour throws `TypeError`. Midnight on a 12-hour clock is `12:00 AM`. Seconds are shown only when `precision` is `"second"` or `"millisecond"`.

## Related

- [`parseTimeOfDay`](../parse-time-of-day/parse-time-of-day.md) reads a clock string.
- [`getTimeOfDay`](../get-time-of-day/get-time-of-day.md) reads the time of day from an instant.
- [`addToTimeOfDay`](../add-to-time-of-day/add-to-time-of-day.md) adds a duration and wraps past midnight.
