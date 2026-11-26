# `isBusinessDay`

Reports whether a date falls on a business day.

## Import

```ts
import { isBusinessDay } from "@sgx4u/date-time";
```

## Signature

```ts
function isBusinessDay(date: DateInput, calendar?: BusinessCalendar): boolean;
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
import { isBusinessDay } from "@sgx4u/date-time";

isBusinessDay("2026-11-26T00:00:00Z", { timeZone: "UTC" });
// true

isBusinessDay("2026-11-28T00:00:00Z", { timeZone: "UTC" });
// false

isBusinessDay("2026-11-26T00:00:00Z", {
    timeZone: "UTC",
    holidays: ["2026-11-26"],
});
// false
```

## Edge cases

A business day is a day whose ISO weekday is not in `weekendDays` and that `holidays` does not match. The default weekend is Saturday and Sunday. `workingHours` does not affect this check. A value that is not a real date throws a `RangeError`.

## Related

- [`isWithinBusinessHours`](../is-within-business-hours/is-within-business-hours.md)
- [`getNextBusinessDay`](../get-next-business-day/get-next-business-day.md)
- [`isWeekend`](../is-weekend/is-weekend.md)
