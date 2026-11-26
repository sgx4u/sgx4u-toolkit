# `addBusinessDays`

Moves a date by a number of business days and keeps the time of day.

## Import

```ts
import { addBusinessDays } from "@sgx4u/date-time";
```

## Signature

```ts
function addBusinessDays(
    date: DateInput,
    amount: number,
    calendar?: BusinessCalendar,
): Date;
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
addBusinessDays("2026-11-27T15:00:00Z", 1, { timeZone: "UTC" }).toISOString();
// "2026-11-30T15:00:00.000Z"

addBusinessDays("2026-11-28T15:00:00Z", 1, { timeZone: "UTC" }).toISOString();
// "2026-11-30T15:00:00.000Z"

addBusinessDays("2026-11-27T15:00:00Z", 0, { timeZone: "UTC" }).toISOString();
// "2026-11-27T15:00:00.000Z"
```

## Edge cases

A non-integer `amount` throws `RangeError`. A value of the wrong type throws `TypeError`. Zero returns the same instant. A negative amount walks backward. A start on a weekend or holiday does not count; the first step lands on the next business day in that direction. 3660 consecutive closed days throws `RangeError`.

## Related

- [`differenceInBusinessDays`](../difference-in-business-days/difference-in-business-days.md) counts business days in a half-open range.
- [`addBusinessHours`](../add-business-hours/add-business-hours.md) adds working time inside open hours.
- [`isBusinessDay`](../is-business-day/is-business-day.md) reports whether a calendar day is open.
