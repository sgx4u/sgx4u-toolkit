# `differenceInBusinessDays`

Counts business days in the half-open calendar range `[earlier, later)`.

## Import

```ts
import { differenceInBusinessDays } from "@sgx4u/date-time";
```

## Signature

```ts
function differenceInBusinessDays(
    params: DifferenceInBusinessDaysParams,
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
differenceInBusinessDays({
    later: "2026-11-30T00:00:00Z",
    earlier: "2026-11-27T00:00:00Z",
    timeZone: "UTC",
});
// 1

differenceInBusinessDays({
    later: "2026-11-27T00:00:00Z",
    earlier: "2026-11-30T00:00:00Z",
    timeZone: "UTC",
});
// -1

differenceInBusinessDays({
    later: "2024-03-01T00:00:00Z",
    earlier: "2024-02-28T00:00:00Z",
    timeZone: "UTC",
});
// 2
```

Friday 27 November 2026 is inside the first range and Monday 30 November is excluded, so the weekend drops out and the count is 1. Wednesday 28 February and Thursday 29 February 2024 are both inside the third range, and Friday 1 March is excluded.

## Edge cases

The calendar day of `later` is excluded. The result is negative when `later` is before `earlier`. A holiday in the range is skipped. 3660 consecutive days with no business day throws `RangeError`. An invalid date throws `RangeError`.

## Related

- [`addBusinessDays`](../add-business-days/add-business-days.md) moves a date by business days.
- [`differenceInBusinessHours`](../difference-in-business-hours/difference-in-business-hours.md) measures open hours between two instants.
- [`isBusinessDay`](../is-business-day/is-business-day.md) reports whether one calendar day is open.
