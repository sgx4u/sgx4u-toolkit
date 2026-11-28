# `getPreviousBusinessDay`

Returns the start of the previous business day.

## Import

```ts
import { getPreviousBusinessDay } from "@sgx4u/date-time";
```

## Signature

```ts
function getPreviousBusinessDay(
    params: GetPreviousBusinessDayParams,
): Date | undefined;
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
import { getPreviousBusinessDay } from "@sgx4u/date-time";

getPreviousBusinessDay({
    date: "2026-11-30T15:00:00Z",
    timeZone: "UTC",
}).toISOString();
// "2026-11-27T00:00:00.000Z"

getPreviousBusinessDay({
    date: "2026-11-27T15:00:00Z",
    timeZone: "UTC",
}).toISOString();
// "2026-11-26T00:00:00.000Z"

getPreviousBusinessDay({
    date: "2026-11-30T15:00:00Z",
    timeZone: "UTC",
    holidays: ["2026-11-27"],
}).toISOString();
// "2026-11-26T00:00:00.000Z"
```

## Edge cases

The current day is never returned. Monday moves back to Friday when the weekend is Saturday and Sunday. A holiday on that Friday is skipped too. The search throws a `RangeError` when 3660 consecutive days have no business day.

## Related

- [`getNextBusinessDay`](../get-next-business-day/get-next-business-day.md)
- [`isBusinessDay`](../is-business-day/is-business-day.md)
- [`listBusinessDaysInInterval`](../list-business-days-in-interval/list-business-days-in-interval.md)
