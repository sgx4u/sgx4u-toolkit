# `formatRelativeTime`

Formats a date as relative time, such as `3 days ago` or `in 2 hours`.

## Import

```ts
import { formatRelativeTime } from "@sgx4u/date-time";
```

## Signature

```ts
function formatRelativeTime(
    date: DateInput,
    options?: FormatRelativeTimeOptions,
): string;
```

## Options

| Name      | Type                            | Default        | Meaning                                                                                      |
| --------- | ------------------------------- | -------------- | -------------------------------------------------------------------------------------------- |
| `now`     | `DateInput`                     | Current time   | Instant the date is compared with.                                                           |
| `unit`    | `TimeUnit \| "auto"`            | `"auto"`       | Unit to use. `"auto"` picks one from the elapsed time. Weeks are never chosen automatically. |
| `locale`  | `string \| readonly string[]`   | Runtime locale | Locale for the text.                                                                         |
| `style`   | `"long" \| "short" \| "narrow"` | `"long"`       | Length of the unit name.                                                                     |
| `numeric` | `"always" \| "auto"`            | `"auto"`       | `"auto"` allows words such as "yesterday". `"always"` uses a number.                         |

## Examples

```ts
formatRelativeTime("2026-01-04T00:00:00Z", {
    now: "2026-01-01T00:00:00Z",
    locale: "en",
});
// "in 3 days"

formatRelativeTime("2026-01-01T03:00:00Z", {
    now: "2026-01-01T00:00:00Z",
    locale: "en",
    unit: "hour",
});
// "in 3 hours"
```

## Edge cases

The text comes from `Intl.RelativeTimeFormat`. A millisecond result uses `Intl.NumberFormat`. An unknown `style` or `numeric` throws `RangeError`. A date that does not parse throws `RangeError`. `"auto"` chooses the unit from the elapsed time and does not choose weeks.

## Related

- [`getRelativeTimeParts`](../get-relative-time-parts/get-relative-time-parts.md) returns the value and the unit before formatting.
- [`formatRelativeCalendarDay`](../format-relative-calendar-day/format-relative-calendar-day.md) writes today, yesterday, or a weekday with a time.
