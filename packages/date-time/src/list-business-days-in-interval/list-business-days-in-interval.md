# `listBusinessDaysInInterval`

Lists the start of each business day that overlaps an interval.

## Import

```ts
import { listBusinessDaysInInterval } from "@sgx4u/date-time";
```

## Signature

```ts
function listBusinessDaysInInterval(
    params: ListBusinessDaysInIntervalParams,
): Date[];
```

## Parameters

| Name            | Type                                          | Required | Default                              | Meaning                                                                     |
| --------------- | --------------------------------------------- | -------- | ------------------------------------ | --------------------------------------------------------------------------- |
| `start`         | `DateInput`                                   | yes      |                                      | The inclusive start of the half-open interval.                              |
| `end`           | `DateInput`                                   | yes      |                                      | The exclusive end of the half-open interval.                                |
| `workingDays`   | `readonly Weekday[]`                          | no       | `[1, 2, 3, 4, 5]`                    | ISO weekdays that count as business days. Every other weekday is a weekend. |
| `holidays`      | `readonly (ConfiguredHoliday \| DateInput)[]` | no       | `[]`                                 | Dates that are closed.                                                      |
| `businessHours` | `readonly TimeRange[]`                        | no       | `[{ start: "09:00", end: "17:00" }]` | Working windows for a business day. An empty list means the whole day.      |
| `timeZone`      | `string`                                      | no       | The system time zone.                | IANA time zone or fixed offset the calendar uses.                           |

## Examples

```ts
import { listBusinessDaysInInterval } from "@sgx4u/date-time";

listBusinessDaysInInterval({
    interval: {
        start: new Date("2026-11-27T00:00:00Z"),
        end: new Date("2026-11-30T00:00:00Z"),
    },
    timeZone: "UTC",
}).map((date) => date.toISOString());
// ["2026-11-27T00:00:00.000Z"]

listBusinessDaysInInterval({
    interval: {
        start: new Date("2026-11-27T00:00:00Z"),
        end: new Date("2026-12-01T00:00:00Z"),
    },
    timeZone: "UTC",
}).map((date) => date.toISOString());
// ["2026-11-27T00:00:00.000Z", "2026-11-30T00:00:00.000Z"]

listBusinessDaysInInterval({
    interval: {
        start: new Date("2026-11-27T00:00:00Z"),
        end: new Date("2026-12-01T00:00:00Z"),
    },
    timeZone: "UTC",
    holidays: ["2026-11-27"],
}).length;
// 1
```

## Edge cases

The interval is half-open, so a business day that starts at `end` is not included. Weekend days are omitted. The result is oldest first. More than 100000 days throws a `RangeError`.

## Related

- [`isBusinessDay`](../is-business-day/is-business-day.md)
- [`getNextBusinessDay`](../get-next-business-day/get-next-business-day.md)
- [`listDatesInInterval`](../list-dates-in-interval/list-dates-in-interval.md)
