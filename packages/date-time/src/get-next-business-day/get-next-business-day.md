# `getNextBusinessDay`

Returns the start of the next business day.

## Import

```ts
import { getNextBusinessDay } from "@sgx4u/date-time";
```

## Signature

```ts
function getNextBusinessDay(params: GetNextBusinessDayParams): Date | undefined;
```

## Parameters

| Name            | Type                                          | Required | Default                              | Meaning                                                                     |
| --------------- | --------------------------------------------- | -------- | ------------------------------------ | --------------------------------------------------------------------------- |
| `date`          | `DateInput`                                   | yes      |                                      | The date to move from.                                                      |
| `workingDays`   | `readonly Weekday[]`                          | no       | `[1, 2, 3, 4, 5]`                    | ISO weekdays that count as business days. Every other weekday is a weekend. |
| `holidays`      | `readonly (ConfiguredHoliday \| DateInput)[]` | no       | `[]`                                 | Dates that are closed.                                                      |
| `businessHours` | `readonly TimeRange[]`                        | no       | `[{ start: "09:00", end: "17:00" }]` | Working windows for a business day. An empty list means the whole day.      |
| `timeZone`      | `string`                                      | no       | The system time zone.                | IANA time zone or fixed offset the calendar uses.                           |

## Examples

```ts
import { getNextBusinessDay } from "@sgx4u/date-time";

getNextBusinessDay({
    date: "2026-11-26T15:00:00Z",
    timeZone: "UTC",
}).toISOString();
// "2026-11-27T00:00:00.000Z"

getNextBusinessDay({
    date: "2026-11-27T15:00:00Z",
    timeZone: "UTC",
}).toISOString();
// "2026-11-30T00:00:00.000Z"

getNextBusinessDay({
    date: "2026-11-26T15:00:00Z",
    timeZone: "UTC",
    holidays: ["2026-11-27"],
}).toISOString();
// "2026-11-30T00:00:00.000Z"
```

## Edge cases

The current day is never returned, even when it is a business day. The default weekend is Saturday and Sunday, so Friday moves to Monday. A holiday on the next weekday is skipped. The search throws a `RangeError` when 3660 consecutive days have no business day.

## Related

- [`getPreviousBusinessDay`](../get-previous-business-day/get-previous-business-day.md)
- [`isBusinessDay`](../is-business-day/is-business-day.md)
- [`getNextBusinessHoursStart`](../get-next-business-hours-start/get-next-business-hours-start.md)
