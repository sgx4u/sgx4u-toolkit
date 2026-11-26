# `differenceInBusinessHours`

Returns the signed number of working hours between two instants.

## Import

```ts
import { differenceInBusinessHours } from "@sgx4u/date-time";
```

## Signature

```ts
function differenceInBusinessHours(
    later: DateInput,
    earlier: DateInput,
    calendar?: BusinessCalendar,
): number;
```

## Options

Fields of `calendar`:

| Name           | Type                                                | Default                              | Meaning                                                                      |
| -------------- | --------------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------- |
| `weekendDays`  | `readonly Weekday[]`                                | `[6, 7]`                             | ISO weekdays that are closed. `6` is Saturday and `7` is Sunday.             |
| `holidays`     | `readonly DateInput[] \| ((date: Date) => boolean)` | `[]`                                 | Closed dates, or a predicate. A list matches the calendar day in `timeZone`. |
| `workingHours` | `readonly TimeRange[]`                              | `[{ start: "09:00", end: "17:00" }]` | Open windows. An empty list means the whole business day.                    |
| `timeZone`     | `string`                                            | System zone                          | IANA name or fixed offset for the calendar and the windows.                  |

## Examples

```ts
differenceInBusinessHours("2026-11-27T10:00:00Z", "2026-11-26T16:00:00Z", {
    timeZone: "UTC",
});
// 2

differenceInBusinessHours("2026-11-26T09:00:00Z", "2026-11-26T08:00:00Z", {
    timeZone: "UTC",
});
// 0

differenceInBusinessHours("2024-02-29T10:00:00Z", "2024-02-29T09:30:00Z", {
    timeZone: "UTC",
});
// 0.5
```

## Edge cases

Only time inside working hours counts. Time before the window, after it, or on a weekend is zero. The result is fractional and is negative when `later` is before `earlier`. 3660 consecutive days with no business day throws `RangeError`. An invalid date throws `RangeError`.

## Related

- [`addBusinessHours`](../add-business-hours/add-business-hours.md) adds a clock duration of working time.
- [`differenceInBusinessDays`](../difference-in-business-days/difference-in-business-days.md) counts business days.
- [`isWithinBusinessHours`](../is-within-business-hours/is-within-business-hours.md) reports whether an instant is inside an open window.
