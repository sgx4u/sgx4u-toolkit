# `differenceInBusinessHours`

Returns the signed number of working hours between two instants.

## Import

```ts
import { differenceInBusinessHours } from "@sgx4u/date-time";
```

## Signature

```ts
function differenceInBusinessHours(
    params: DifferenceInBusinessHoursParams,
): number | undefined;
```

## Parameters

| Name            | Type                                          | Required | Default                              | Meaning                                                                     |
| --------------- | --------------------------------------------- | -------- | ------------------------------------ | --------------------------------------------------------------------------- |
| `later`         | `DateInput`                                   | yes      |                                      | The end date.                                                               |
| `earlier`       | `DateInput`                                   | yes      |                                      | The start date.                                                             |
| `workingDays`   | `readonly Weekday[]`                          | no       | `[1, 2, 3, 4, 5]`                    | ISO weekdays that count as business days. Every other weekday is a weekend. |
| `holidays`      | `readonly (ConfiguredHoliday \| DateInput)[]` | no       | `[]`                                 | Dates that are closed.                                                      |
| `businessHours` | `readonly TimeRange[]`                        | no       | `[{ start: "09:00", end: "17:00" }]` | Working windows for a business day. An empty list means the whole day.      |
| `timeZone`      | `string`                                      | no       | The system time zone.                | IANA time zone or fixed offset the calendar uses.                           |

## Examples

```ts
differenceInBusinessHours({
    later: "2026-11-27T10:00:00Z",
    earlier: "2026-11-26T16:00:00Z",
    timeZone: "UTC",
});
// 2

differenceInBusinessHours({
    later: "2026-11-26T09:00:00Z",
    earlier: "2026-11-26T08:00:00Z",
    timeZone: "UTC",
});
// 0

differenceInBusinessHours({
    later: "2024-02-29T10:00:00Z",
    earlier: "2024-02-29T09:30:00Z",
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
