# `addBusinessHours`

Adds working time, skipping nights, weekends, and holidays.

## Import

```ts
import { addBusinessHours } from "@sgx4u/date-time";
```

## Signature

```ts
function addBusinessHours(
    date: DateInput,
    duration: Duration,
    calendar?: BusinessCalendar,
): Date;
```

## Options

Fields of `calendar`:

| Name           | Type                                                | Default                              | Meaning                                                                      |
| -------------- | --------------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------- |
| `weekendDays`  | `readonly Weekday[]`                                | `[6, 7]`                             | ISO weekdays that are closed. `6` is Saturday and `7` is Sunday.             |
| `holidays`     | `readonly DateInput[] \| ((date: Date) => boolean)` | `[]`                                 | Closed dates, or a predicate. A list matches the calendar day in `timeZone`. |
| `workingHours` | `readonly TimeRange[]`                              | `[{ start: "09:00", end: "17:00" }]` | Open windows on a business day. An empty list means the whole day.           |
| `timeZone`     | `string`                                            | System zone                          | IANA name or fixed offset for the calendar and the windows.                  |

## Examples

```ts
addBusinessHours(
    "2026-11-26T16:00:00Z",
    { hours: 2 },
    { timeZone: "UTC" },
).toISOString();
// "2026-11-27T10:00:00.000Z"

addBusinessHours(
    "2026-11-26T16:00:00Z",
    { hours: 1 },
    { timeZone: "UTC" },
).toISOString();
// "2026-11-26T17:00:00.000Z"

addBusinessHours(
    "2026-11-28T12:00:00Z",
    { hours: 1 },
    { timeZone: "UTC" },
).toISOString();
// "2026-11-30T10:00:00.000Z"
```

Thursday 26 November 2026 at 16:00 has one open hour left before 17:00. The second hour starts at 09:00 on Friday.

## Edge cases

Only clock units are accepted. Years, months, weeks, or days throw `RangeError`. A positive duration that starts outside open hours begins at the next opening. A negative duration begins at the end of the previous opening. 3660 consecutive days with no business day throws `RangeError`. An invalid date throws `RangeError`.

## Related

- [`differenceInBusinessHours`](../difference-in-business-hours/difference-in-business-hours.md) measures open time between two instants.
- [`addBusinessDays`](../add-business-days/add-business-days.md) steps by whole business days.
- [`isWithinBusinessHours`](../is-within-business-hours/is-within-business-hours.md) reports whether an instant is inside an open window.
