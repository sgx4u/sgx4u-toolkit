# `formatRelativeCalendarDay`

Formats a date as a nearby day plus a time, then as a full date.

## Import

```ts
import { formatRelativeCalendarDay } from "@sgx4u/date-time";
```

## Signature

```ts
function formatRelativeCalendarDay(
    params: FormatRelativeCalendarDayParams,
): string | undefined;
```

## Parameters

| Name        | Type                          | Required | Default                                  | Meaning                                                       |
| ----------- | ----------------------------- | -------- | ---------------------------------------- | ------------------------------------------------------------- |
| `date`      | `DateInput`                   | yes      |                                          | The date to describe.                                         |
| `timeStyle` | `"short" \| "medium"`         | no       | `"short"`                                | The length of the time.                                       |
| `now`       | `DateInput`                   | no       | `Date.now()`, read on each call.         | The instant to use instead of the current time.               |
| `timeZone`  | `string`                      | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset            |
| `locale`    | `string \| readonly string[]` | no       | The runtime's default locale.            | A BCP 47 language tag, or a list of tags in preference order. |

## Examples

```ts
formatRelativeCalendarDay({
    date: "2026-01-02T17:00:00Z",
    now: "2026-01-02T12:00:00Z",
    timeZone: "UTC",
    locale: "en",
});
// "Today at 5:00 PM"

formatRelativeCalendarDay({
    date: "2026-01-01T17:00:00Z",
    now: "2026-01-02T12:00:00Z",
    timeZone: "UTC",
    locale: "en",
});
// "Yesterday at 5:00 PM"

formatRelativeCalendarDay({
    date: "2026-01-06T17:00:00Z",
    now: "2026-01-02T12:00:00Z",
    timeZone: "UTC",
    locale: "en",
});
// "Tuesday at 5:00 PM"

formatRelativeCalendarDay({
    date: "2024-03-10T07:30:00Z",
    now: "2024-03-10T16:00:00Z",
    timeZone: "America/New_York",
    locale: "en-US",
});
// "Today at 3:30 AM"
```

## Edge cases

The same calendar day is "Today at {time}". The previous and next days use yesterday and tomorrow. Days from 2 through 6 away use the weekday name. Anything further away uses a medium date and the time, such as `"Feb 1, 2026, 5:00 PM"`. `timeStyle: "medium"` writes seconds, such as `"Today at 5:00:00 PM"`. An unknown `timeStyle` throws `RangeError`. A date that is not usable returns `undefined`. On the New York spring-forward morning, `2024-03-10T06:30:00Z` is `"Today at 1:30 AM"` and `2024-03-10T07:30:00Z` is `"Today at 3:30 AM"`.

## Related

- [`formatRelativeTime`](../format-relative-time/format-relative-time.md) writes a relative unit such as `in 3 days`.
- [`getRelativeTimeParts`](../get-relative-time-parts/get-relative-time-parts.md) returns the unit and the value.
