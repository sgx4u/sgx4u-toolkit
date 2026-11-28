# `getNextBusinessHoursStart`

Returns the date itself when it is inside working hours, otherwise the next opening.

## Import

```ts
import { getNextBusinessHoursStart } from "@sgx4u/date-time";
```

## Signature

```ts
function getNextBusinessHoursStart(
    params: GetNextBusinessHoursStartParams,
): Date | undefined;
```

## Parameters

| Name            | Type                                          | Required | Default                              | Meaning                                                                     |
| --------------- | --------------------------------------------- | -------- | ------------------------------------ | --------------------------------------------------------------------------- |
| `date`          | `DateInput`                                   | yes      |                                      | The date to measure from.                                                   |
| `workingDays`   | `readonly Weekday[]`                          | no       | `[1, 2, 3, 4, 5]`                    | ISO weekdays that count as business days. Every other weekday is a weekend. |
| `holidays`      | `readonly (ConfiguredHoliday \| DateInput)[]` | no       | `[]`                                 | Dates that are closed.                                                      |
| `businessHours` | `readonly TimeRange[]`                        | no       | `[{ start: "09:00", end: "17:00" }]` | Working windows for a business day. An empty list means the whole day.      |
| `timeZone`      | `string`                                      | no       | The system time zone.                | IANA time zone or fixed offset the calendar uses.                           |

## Examples

```ts
import { getNextBusinessHoursStart } from "@sgx4u/date-time";

getNextBusinessHoursStart({
    date: "2026-11-26T08:00:00Z",
    timeZone: "UTC",
}).toISOString();
// "2026-11-26T09:00:00.000Z"

getNextBusinessHoursStart({
    date: "2026-11-26T12:00:00Z",
    timeZone: "UTC",
}).toISOString();
// "2026-11-26T12:00:00.000Z"

getNextBusinessHoursStart({
    date: "2026-11-26T17:00:00Z",
    timeZone: "UTC",
}).toISOString();
// "2026-11-27T09:00:00.000Z"
```

## Edge cases

The default window is 09:00–17:00 and the end is excluded, so 17:00 is already closed. An instant inside the window is returned unchanged. Weekends and holidays are skipped. The search throws a `RangeError` when 3660 consecutive days have no business day.

## Related

- [`isWithinBusinessHours`](../is-within-business-hours/is-within-business-hours.md)
- [`getNextBusinessDay`](../get-next-business-day/get-next-business-day.md)
- [`getNextOpeningTime`](../get-next-opening-time/get-next-opening-time.md)
