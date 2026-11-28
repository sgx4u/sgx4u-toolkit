# `addBusinessHours`

Adds working time, skipping nights, weekends, and holidays.

## Import

```ts
import { addBusinessHours } from "@sgx4u/date-time";
```

## Signature

```ts
function addBusinessHours(params: AddBusinessHoursParams): Date | undefined;
```

## Parameters

| Name            | Type                                          | Required | Default                              | Meaning                                                                     |
| --------------- | --------------------------------------------- | -------- | ------------------------------------ | --------------------------------------------------------------------------- |
| `date`          | `DateInput`                                   | yes      |                                      | The start instant.                                                          |
| `duration`      | `Duration`                                    | yes      |                                      | Hours, minutes, seconds, or milliseconds.                                   |
| `workingDays`   | `readonly Weekday[]`                          | no       | `[1, 2, 3, 4, 5]`                    | ISO weekdays that count as business days. Every other weekday is a weekend. |
| `holidays`      | `readonly (ConfiguredHoliday \| DateInput)[]` | no       | `[]`                                 | Dates that are closed.                                                      |
| `businessHours` | `readonly TimeRange[]`                        | no       | `[{ start: "09:00", end: "17:00" }]` | Working windows for a business day. An empty list means the whole day.      |
| `timeZone`      | `string`                                      | no       | The system time zone.                | IANA time zone or fixed offset the calendar uses.                           |

## Examples

```ts
addBusinessHours({
    date: "2026-11-26T16:00:00Z",
    duration: { hours: 2 },
    timeZone: "UTC",
})?.toISOString();
// "2026-11-27T10:00:00.000Z"
```

## Edge cases

Only clock units are accepted; calendar units throw `RangeError`. A start outside working hours begins at the next opening when the duration is positive, or at the end of the previous opening when it is negative. A bad `date` or `duration` returns `undefined`. Invalid `workingDays`, `businessHours`, or `timeZone` throws. When no business day exists within the safety cap, the call throws `RangeError`.

## Related

- [`addBusinessDays`](../add-business-days/add-business-days.md) moves by whole business days.
- [`differenceInBusinessHours`](../difference-in-business-hours/difference-in-business-hours.md) measures elapsed working time.
