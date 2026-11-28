# `addBusinessDays`

Moves a date by a number of business days, keeping the time of day.

## Import

```ts
import { addBusinessDays } from "@sgx4u/date-time";
```

## Signature

```ts
function addBusinessDays(params: AddBusinessDaysParams): Date | undefined;
```

## Parameters

| Name            | Type                                          | Required | Default                              | Meaning                                                                     |
| --------------- | --------------------------------------------- | -------- | ------------------------------------ | --------------------------------------------------------------------------- |
| `date`          | `DateInput`                                   | yes      |                                      | The starting instant.                                                       |
| `amount`        | `number`                                      | yes      |                                      | Business days to add.                                                       |
| `workingDays`   | `readonly Weekday[]`                          | no       | `[1, 2, 3, 4, 5]`                    | ISO weekdays that count as business days. Every other weekday is a weekend. |
| `holidays`      | `readonly (ConfiguredHoliday \| DateInput)[]` | no       | `[]`                                 | Dates that are closed.                                                      |
| `businessHours` | `readonly TimeRange[]`                        | no       | `[{ start: "09:00", end: "17:00" }]` | Working windows for a business day. An empty list means the whole day.      |
| `timeZone`      | `string`                                      | no       | The system time zone.                | IANA time zone or fixed offset the calendar uses.                           |

## Examples

```ts
addBusinessDays({
    date: "2026-11-27T15:00:00Z",
    amount: 1,
    timeZone: "UTC",
})?.toISOString();
// "2026-11-30T15:00:00.000Z"

addBusinessDays({
    date: "2026-11-28T15:00:00Z",
    amount: 1,
    timeZone: "UTC",
})?.toISOString();
// "2026-11-30T15:00:00.000Z"
```

## Edge cases

Zero returns the same instant. A negative amount moves backward. A start on a weekend or holiday does not count; the first step lands on the next business day in that direction. A bad `date` or non-integer `amount` returns `undefined`. Invalid `workingDays`, `businessHours`, or `timeZone` throws. When no business day exists within the safety cap, the call throws `RangeError`.

## Related

- [`addBusinessHours`](../add-business-hours/add-business-hours.md) adds working time inside open hours.
- [`getNextBusinessDay`](../get-next-business-day/get-next-business-day.md) finds the next open day.
