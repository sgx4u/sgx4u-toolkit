# `getNextBusinessDay`

Returns the start of the next business day.

## Import

```ts
import { getNextBusinessDay } from "@sgx4u/date-time";
```

## Signature

```ts
function getNextBusinessDay(date: DateInput, calendar?: BusinessCalendar): Date;
```

## Options

The `calendar` argument is optional. Omitted fields use these defaults.

| Name           | Type                                                | Default                              | Meaning                                                                                                   |
| -------------- | --------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `weekendDays`  | `readonly Weekday[]`                                | `[6, 7]`                             | ISO weekdays that are not business days.                                                                  |
| `holidays`     | `readonly DateInput[] \| ((date: Date) => boolean)` | `[]`                                 | Closed dates, or a predicate that reports a holiday. A list is matched on the calendar day in `timeZone`. |
| `workingHours` | `readonly TimeRange[]`                              | `[{ start: "09:00", end: "17:00" }]` | Working windows on a business day. An empty list means the whole day.                                     |
| `timeZone`     | `string`                                            | The system time zone                 | IANA time zone or fixed offset the calendar uses.                                                         |

## Examples

```ts
import { getNextBusinessDay } from "@sgx4u/date-time";

getNextBusinessDay("2026-11-26T15:00:00Z", {
    timeZone: "UTC",
}).toISOString();
// "2026-11-27T00:00:00.000Z"

getNextBusinessDay("2026-11-27T15:00:00Z", {
    timeZone: "UTC",
}).toISOString();
// "2026-11-30T00:00:00.000Z"

getNextBusinessDay("2026-11-26T15:00:00Z", {
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
