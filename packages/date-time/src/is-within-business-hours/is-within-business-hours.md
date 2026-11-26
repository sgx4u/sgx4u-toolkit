# `isWithinBusinessHours`

Reports whether a date is inside working hours on a business day.

## Import

```ts
import { isWithinBusinessHours } from "@sgx4u/date-time";
```

## Signature

```ts
function isWithinBusinessHours(
    date: DateInput,
    calendar?: BusinessCalendar,
): boolean;
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
import { isWithinBusinessHours } from "@sgx4u/date-time";

isWithinBusinessHours("2026-11-26T12:00:00Z", { timeZone: "UTC" });
// true

isWithinBusinessHours("2026-11-26T09:00:00Z", { timeZone: "UTC" });
// true

isWithinBusinessHours("2026-11-26T17:00:00Z", { timeZone: "UTC" });
// false

isWithinBusinessHours("2026-11-28T12:00:00Z", { timeZone: "UTC" });
// false
```

## Edge cases

The default window is 09:00–17:00. The start is included and the end is excluded. Weekends and holidays are closed even during those clock hours. A value that is not a real date throws a `RangeError`.

## Related

- [`isBusinessDay`](../is-business-day/is-business-day.md)
- [`getNextBusinessHoursStart`](../get-next-business-hours-start/get-next-business-hours-start.md)
- [`isOpenAt`](../is-open-at/is-open-at.md)
