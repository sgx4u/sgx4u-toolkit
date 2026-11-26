# `unitedStatesHolidayRules`

Lists the eleven United States federal holidays, observing Saturday on Friday and Sunday on Monday.

## Import

```ts
import { unitedStatesHolidayRules } from "@sgx4u/date-time/holidays/united-states";
import { getHolidaysInYear } from "@sgx4u/date-time";
```

## Signature

```ts
const unitedStatesHolidayRules: readonly HolidayRule[];
```

## Options

This function has no options.

## Examples

```ts
import { unitedStatesHolidayRules } from "@sgx4u/date-time/holidays/united-states";
import { getHolidaysInYear } from "@sgx4u/date-time";

getHolidaysInYear({ year: 2026, rules: unitedStatesHolidayRules }).length;
// 11

getHolidaysInYear({ year: 2026, rules: unitedStatesHolidayRules }).find(
    (holiday) => holiday.name === "Independence Day",
)?.observedDate;
// { year: 2026, month: 7, day: 3 }

getHolidaysInYear({ year: 2026, rules: unitedStatesHolidayRules }).find(
    (holiday) => holiday.name === "Thanksgiving Day",
)?.date;
// { year: 2026, month: 11, day: 26 }

getHolidaysInYear({ year: 2026, rules: unitedStatesHolidayRules }).find(
    (holiday) => holiday.name === "Birthday of Martin Luther King, Jr.",
)?.date;
// { year: 2026, month: 1, day: 19 }
```

## Edge cases

Fixed-date holidays use `nearest-weekday`: a Saturday moves to Friday and a Sunday moves to Monday. Holidays defined as a weekday, such as Thanksgiving and Memorial Day, already fall on that weekday. Pass the array to `getHolidaysInYear` or `isHoliday`.

## Related

- [`getHolidaysInYear`](../../get-holidays-in-year/get-holidays-in-year.md)
- [`getObservedDate`](../../get-observed-date/get-observed-date.md)
- [`indiaHolidayRules`](../../holidays/india-holiday-rules/india-holiday-rules.md)
