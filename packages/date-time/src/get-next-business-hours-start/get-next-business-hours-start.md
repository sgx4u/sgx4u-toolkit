# `getNextBusinessHoursStart`

Returns the date itself when it is inside working hours, otherwise the next opening.

## Import

```ts
import { getNextBusinessHoursStart } from "@sgx4u/date-time";
```

## Signature

```ts
function getNextBusinessHoursStart(
    date: DateInput,
    calendar?: BusinessCalendar,
): Date;
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
import { getNextBusinessHoursStart } from "@sgx4u/date-time";

getNextBusinessHoursStart("2026-11-26T08:00:00Z", {
    timeZone: "UTC",
}).toISOString();
// "2026-11-26T09:00:00.000Z"

getNextBusinessHoursStart("2026-11-26T12:00:00Z", {
    timeZone: "UTC",
}).toISOString();
// "2026-11-26T12:00:00.000Z"

getNextBusinessHoursStart("2026-11-26T17:00:00Z", {
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
