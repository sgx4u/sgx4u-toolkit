# `getObservedDate`

Returns the substitute day when a holiday falls on a weekend.

## Import

```ts
import { getObservedDate } from "@sgx4u/date-time";
```

## Signature

```ts
function getObservedDate(
    date: CalendarDate,
    policy: ObservancePolicy,
    options?: ObservedDateOptions,
): CalendarDate;
```

## Options

| Name          | Type                 | Default  | Meaning                                 |
| ------------- | -------------------- | -------- | --------------------------------------- |
| `weekendDays` | `readonly Weekday[]` | `[6, 7]` | ISO weekdays that count as the weekend. |

## Examples

```ts
import { getObservedDate } from "@sgx4u/date-time";

getObservedDate({ year: 2020, month: 7, day: 4 }, "nearest-weekday");
// { year: 2020, month: 7, day: 3 }

getObservedDate({ year: 2020, month: 7, day: 4 }, "next-monday");
// { year: 2020, month: 7, day: 6 }

getObservedDate({ year: 2020, month: 7, day: 4 }, "none");
// { year: 2020, month: 7, day: 4 }

getObservedDate({ year: 2020, month: 7, day: 4 }, "next-weekday");
// { year: 2020, month: 7, day: 6 }
```

## Edge cases

4 July 2020 was a Saturday. `"nearest-weekday"` moves Saturday to Friday and Sunday to Monday. `"next-weekday"` and `"next-monday"` move a weekend holiday forward to Monday. `"none"` returns the date unchanged. An unknown policy throws a `RangeError`.

## Related

- [`getHoliday`](../get-holiday/get-holiday.md)
- [`getHolidaysInYear`](../get-holidays-in-year/get-holidays-in-year.md)
- [`getEasterSunday`](../get-easter-sunday/get-easter-sunday.md)
