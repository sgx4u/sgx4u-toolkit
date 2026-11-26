# `listBusinessDaysInInterval`

Lists the start of each business day that overlaps an interval.

## Import

```ts
import { listBusinessDaysInInterval } from "@sgx4u/date-time";
```

## Signature

```ts
function listBusinessDaysInInterval(
    interval: Interval,
    calendar?: BusinessCalendar,
): Date[];
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
import { listBusinessDaysInInterval } from "@sgx4u/date-time";

listBusinessDaysInInterval(
    {
        start: new Date("2026-11-27T00:00:00Z"),
        end: new Date("2026-11-30T00:00:00Z"),
    },
    { timeZone: "UTC" },
).map((date) => date.toISOString());
// ["2026-11-27T00:00:00.000Z"]

listBusinessDaysInInterval(
    {
        start: new Date("2026-11-27T00:00:00Z"),
        end: new Date("2026-12-01T00:00:00Z"),
    },
    { timeZone: "UTC" },
).map((date) => date.toISOString());
// ["2026-11-27T00:00:00.000Z", "2026-11-30T00:00:00.000Z"]

listBusinessDaysInInterval(
    {
        start: new Date("2026-11-27T00:00:00Z"),
        end: new Date("2026-12-01T00:00:00Z"),
    },
    { timeZone: "UTC", holidays: ["2026-11-27"] },
).length;
// 1
```

## Edge cases

The interval is half-open, so a business day that starts at `end` is not included. Weekend days are omitted. The result is oldest first. More than 100000 days throws a `RangeError`.

## Related

- [`isBusinessDay`](../is-business-day/is-business-day.md)
- [`getNextBusinessDay`](../get-next-business-day/get-next-business-day.md)
- [`listDatesInInterval`](../list-dates-in-interval/list-dates-in-interval.md)
