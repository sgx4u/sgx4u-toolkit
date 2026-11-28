# `formatRelativeTime`

Formats a date as relative time, such as `3 days ago` or `in 2 hours`.

## Import

```ts
import { formatRelativeTime } from "@sgx4u/date-time";
```

## Signature

```ts
function formatRelativeTime(
    params: FormatRelativeTimeParams,
): string | undefined;
```

## Parameters

| Name      | Type                            | Required | Default                          | Meaning                                                       |
| --------- | ------------------------------- | -------- | -------------------------------- | ------------------------------------------------------------- |
| `date`    | `DateInput`                     | yes      |                                  | The date to describe.                                         |
| `unit`    | `"auto" \| TimeUnit`            | no       | `"auto"`                         | `"auto"` picks the unit from the elapsed time.                |
| `style`   | `"long" \| "short" \| "narrow"` | no       | `"long"`                         | The length of the unit name.                                  |
| `numeric` | `"always" \| "auto"`            | no       | `"auto"`                         | `"auto"` allows words such as "yesterday".                    |
| `now`     | `DateInput`                     | no       | `Date.now()`, read on each call. | The instant to use instead of the current time.               |
| `locale`  | `string \| readonly string[]`   | no       | The runtime's default locale.    | A BCP 47 language tag, or a list of tags in preference order. |

## Examples

```ts
formatRelativeTime({
    date: "2026-01-04T00:00:00Z",
    now: "2026-01-01T00:00:00Z",
    locale: "en",
});
// "in 3 days"

formatRelativeTime({
    date: "2026-01-01T03:00:00Z",
    now: "2026-01-01T00:00:00Z",
    locale: "en",
    unit: "hour",
});
// "in 3 hours"
```

## Edge cases

The text comes from `Intl.RelativeTimeFormat`. A millisecond result uses `Intl.NumberFormat`. An unknown `style` or `numeric` throws `RangeError`. A date that is not usable returns `undefined`. `"auto"` chooses the unit from the elapsed time and does not choose weeks.

## Related

- [`getRelativeTimeParts`](../get-relative-time-parts/get-relative-time-parts.md) returns the value and the unit before formatting.
- [`formatRelativeCalendarDay`](../format-relative-calendar-day/format-relative-calendar-day.md) writes today, yesterday, or a weekday with a time.
