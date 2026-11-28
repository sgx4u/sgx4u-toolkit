# `isWithinBusinessHours`

Reports whether a date is inside working hours on a business day.

## Import

```ts
import { isWithinBusinessHours } from "@sgx4u/date-time";
```

## Signature

```ts
function isWithinBusinessHours(params: IsWithinBusinessHoursParams): boolean;
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
import { isWithinBusinessHours } from "@sgx4u/date-time";

isWithinBusinessHours({ date: "2026-11-26T12:00:00Z", timeZone: "UTC" });
// true

isWithinBusinessHours({ date: "2026-11-26T09:00:00Z", timeZone: "UTC" });
// true

isWithinBusinessHours({ date: "2026-11-26T17:00:00Z", timeZone: "UTC" });
// false

isWithinBusinessHours({ date: "2026-11-28T12:00:00Z", timeZone: "UTC" });
// false
```

## Edge cases

The default window is 09:00–17:00. The start is included and the end is excluded. Weekends and holidays are closed even during those clock hours. A value that is not a real date returns `undefined`.

## Related

- [`isBusinessDay`](../is-business-day/is-business-day.md)
- [`getNextBusinessHoursStart`](../get-next-business-hours-start/get-next-business-hours-start.md)
- [`isOpenAt`](../is-open-at/is-open-at.md)
