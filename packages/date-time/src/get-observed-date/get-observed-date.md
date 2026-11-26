# `getObservedDate`

Returns the substitute day when a holiday falls on a weekend.

## Import

```ts
import { getObservedDate } from "@sgx4u/date-time";
```

## Signature

```ts
function getObservedDate(params: GetObservedDateParams): CalendarDate;
```

## Parameters

| Name          | Type                 | Required | Default           | Meaning                                                            |
| ------------- | -------------------- | -------- | ----------------- | ------------------------------------------------------------------ |
| `date`        | `CalendarDate`       | yes      |                   | The holiday's calendar date.                                       |
| `policy`      | `ObservancePolicy`   | yes      |                   | How a weekend holiday moves.                                       |
| `workingDays` | `readonly Weekday[]` | no       | `[1, 2, 3, 4, 5]` | ISO weekdays that are open. Non-working days count as the weekend. |

## Examples

```ts
import { getObservedDate } from "@sgx4u/date-time";

getObservedDate({
    date: { year: 2020, month: 7, day: 4 },
    policy: "nearest-weekday",
});
// { year: 2020, month: 7, day: 3 }

getObservedDate({
    date: { year: 2020, month: 7, day: 4 },
    policy: "next-monday",
});
// { year: 2020, month: 7, day: 6 }

getObservedDate({ date: { year: 2020, month: 7, day: 4 }, policy: "none" });
// { year: 2020, month: 7, day: 4 }

getObservedDate({
    date: { year: 2020, month: 7, day: 4 },
    policy: "next-weekday",
});
// { year: 2020, month: 7, day: 6 }
```

## Edge cases

4 July 2020 was a Saturday. `"nearest-weekday"` moves Saturday to Friday and Sunday to Monday. `"next-weekday"` and `"next-monday"` move a weekend holiday forward to Monday. `"none"` returns the date unchanged. An unknown policy throws a `RangeError`.

## Related

- [`getHoliday`](../get-holiday/get-holiday.md)
- [`getHolidaysInYear`](../get-holidays-in-year/get-holidays-in-year.md)
- [`getEasterSunday`](../get-easter-sunday/get-easter-sunday.md)
