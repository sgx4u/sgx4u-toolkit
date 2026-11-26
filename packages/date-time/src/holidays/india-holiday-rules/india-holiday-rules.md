# `indiaHolidayRules`

Lists national holidays of India, with fixed dates plus year tables for Holi, Diwali, and the two Eids.

## Import

```ts
import { indiaHolidayRules } from "@sgx4u/date-time/holidays/india";
import { getHolidaysInYear } from "@sgx4u/date-time";
```

## Signature

```ts
const indiaHolidayRules: readonly HolidayRule[];
```

## Options

This function has no options.

## Examples

```ts
import { indiaHolidayRules } from "@sgx4u/date-time/holidays/india";
import { getHolidaysInYear } from "@sgx4u/date-time";

getHolidaysInYear(2026, indiaHolidayRules).find(
    (holiday) => holiday.name === "Holi",
)?.date;
// { year: 2026, month: 3, day: 4 }

getHolidaysInYear(2026, indiaHolidayRules).find(
    (holiday) => holiday.name === "Diwali",
)?.date;
// { year: 2026, month: 11, day: 8 }

getHolidaysInYear(2026, indiaHolidayRules).find(
    (holiday) => holiday.name === "Republic Day",
)?.date;
// { year: 2026, month: 1, day: 26 }

getHolidaysInYear(2024, indiaHolidayRules).some(
    (holiday) => holiday.name === "Holi",
);
// false
```

## Edge cases

Republic Day, Independence Day, and Gandhi Jayanti are fixed. Good Friday and Christmas follow the calendar. Holi, Diwali, Eid al-Fitr, and Eid al-Adha use a year table for 2025 through 2030. A year missing from a table produces no date for that holiday. Years 2028 through 2030 are expected New Delhi dates until the gazette for that year is published.

## Related

- [`getHolidaysInYear`](../../get-holidays-in-year/get-holidays-in-year.md)
- [`unitedStatesHolidayRules`](../../holidays/united-states-holiday-rules/united-states-holiday-rules.md)
- [`unitedKingdomHolidayRules`](../../holidays/united-kingdom-holiday-rules/united-kingdom-holiday-rules.md)
