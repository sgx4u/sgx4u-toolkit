# `isBusinessDay`

Reports whether a date falls on a business day.

## Import

```ts
import { isBusinessDay } from "@sgx4u/date-time";
```

## Signature

```ts
function isBusinessDay(params: IsBusinessDayParams): boolean;
```

## Parameters

| Name            | Type                                          | Required | Default                              | Meaning                                                                     |
| --------------- | --------------------------------------------- | -------- | ------------------------------------ | --------------------------------------------------------------------------- |
| `date`          | `DateInput`                                   | yes      |                                      | The date to test.                                                           |
| `workingDays`   | `readonly Weekday[]`                          | no       | `[1, 2, 3, 4, 5]`                    | ISO weekdays that count as business days. Every other weekday is a weekend. |
| `holidays`      | `readonly (ConfiguredHoliday \| DateInput)[]` | no       | `[]`                                 | Dates that are closed.                                                      |
| `businessHours` | `readonly TimeRange[]`                        | no       | `[{ start: "09:00", end: "17:00" }]` | Working windows for a business day. An empty list means the whole day.      |
| `timeZone`      | `string`                                      | no       | The system time zone.                | IANA time zone or fixed offset the calendar uses.                           |

## Examples

```ts
import { isBusinessDay } from "@sgx4u/date-time";

isBusinessDay({ date: "2026-11-26T00:00:00Z", timeZone: "UTC" });
// true

isBusinessDay({ date: "2026-11-28T00:00:00Z", timeZone: "UTC" });
// false

isBusinessDay({
    date: "2026-11-26T00:00:00Z",
    timeZone: "UTC",
    holidays: ["2026-11-26"],
});
// false
```

## Edge cases

A business day is a day whose ISO weekday is in `workingDays` and that `holidays` does not match. The default working week is Monday through Friday. `businessHours` does not affect this check. A value that is not a real date returns `undefined`.

## Related

- [`isWithinBusinessHours`](../is-within-business-hours/is-within-business-hours.md)
- [`getNextBusinessDay`](../get-next-business-day/get-next-business-day.md)
- [`isWeekend`](../is-weekend/is-weekend.md)
