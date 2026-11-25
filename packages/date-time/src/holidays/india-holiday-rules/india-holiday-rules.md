# `indiaHolidayRules`

National holidays of India. Republic Day, Independence Day, and Gandhi Jayanti are fixed. Holi, Diwali, and the two Eids use a year table for 2025 through 2030.

## Import

```ts
import { indiaHolidayRules } from "@sgx4u/date-time/holidays/india";
```

## Examples

Pass the array to `getHolidaysInYear`. In 2026, Holi is 4 March, Diwali is 8 November, and United States Independence Day is observed on 3 July.

## Edge cases

A year missing from an India year table produces no date for that holiday. Years 2028 through 2030 in the India tables are expected dates until the gazette for that year is published.

## Related

- [`getHolidaysInYear`](../../get-holidays-in-year/get-holidays-in-year.md)
