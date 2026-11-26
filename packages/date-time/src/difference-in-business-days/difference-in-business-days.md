# `differenceInBusinessDays`

Counts business days in the half-open calendar range `[earlier, later)`.

## Import

```ts
import { differenceInBusinessDays } from "@sgx4u/date-time";
```

## Signature

```ts
function differenceInBusinessDays(
    later: DateInput,
    earlier: DateInput,
    calendar?: BusinessCalendar,
): number;
```

## Options

Fields of `calendar`:

| Name          | Type                                                | Default     | Meaning                                                                      |
| ------------- | --------------------------------------------------- | ----------- | ---------------------------------------------------------------------------- |
| `weekendDays` | `readonly Weekday[]`                                | `[6, 7]`    | ISO weekdays that are closed. `6` is Saturday and `7` is Sunday.             |
| `holidays`    | `readonly DateInput[] \| ((date: Date) => boolean)` | `[]`        | Closed dates, or a predicate. A list matches the calendar day in `timeZone`. |
| `timeZone`    | `string`                                            | System zone | IANA name or fixed offset used for the calendar day.                         |

## Examples

```ts
differenceInBusinessDays("2026-11-30T00:00:00Z", "2026-11-27T00:00:00Z", {
    timeZone: "UTC",
});
// 1

differenceInBusinessDays("2026-11-27T00:00:00Z", "2026-11-30T00:00:00Z", {
    timeZone: "UTC",
});
// -1

differenceInBusinessDays("2024-03-01T00:00:00Z", "2024-02-28T00:00:00Z", {
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
