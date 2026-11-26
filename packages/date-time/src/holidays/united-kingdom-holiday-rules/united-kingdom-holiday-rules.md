# `unitedKingdomHolidayRules`

Lists bank holidays for England and Wales, moving a weekend holiday to the next free weekday.

## Import

```ts
import { unitedKingdomHolidayRules } from "@sgx4u/date-time/holidays/united-kingdom";
import { getHolidaysInYear } from "@sgx4u/date-time";
```

## Signature

```ts
const unitedKingdomHolidayRules: readonly HolidayRule[];
```

## Options

This function has no options.

## Examples

```ts
import { unitedKingdomHolidayRules } from "@sgx4u/date-time/holidays/united-kingdom";
import { getHolidaysInYear } from "@sgx4u/date-time";

getHolidaysInYear(2026, unitedKingdomHolidayRules).find(
    (holiday) => holiday.name === "Good Friday",
)?.date;
// { year: 2026, month: 4, day: 3 }

getHolidaysInYear(2021, unitedKingdomHolidayRules).find(
    (holiday) => holiday.name === "Christmas Day",
)?.observedDate;
// { year: 2021, month: 12, day: 27 }

getHolidaysInYear(2021, unitedKingdomHolidayRules).find(
    (holiday) => holiday.name === "Boxing Day",
)?.observedDate;
// { year: 2021, month: 12, day: 28 }

getHolidaysInYear(2026, unitedKingdomHolidayRules).find(
    (holiday) => holiday.name === "Early May bank holiday",
)?.date;
// { year: 2026, month: 5, day: 4 }
```

## Edge cases

The list is New Year's Day, Good Friday, Easter Monday, the early May holiday, the spring holiday, the summer holiday, Christmas Day, and Boxing Day. Each rule has type `"bank"`. A weekend holiday moves to the next weekday, and a day that is already a holiday moves forward again. In 2021, Saturday Christmas and Sunday Boxing Day are observed on Monday 27 December and Tuesday 28 December.

## Related

- [`getHolidaysInYear`](../../get-holidays-in-year/get-holidays-in-year.md)
- [`getEasterSunday`](../../get-easter-sunday/get-easter-sunday.md)
- [`unitedStatesHolidayRules`](../../holidays/united-states-holiday-rules/united-states-holiday-rules.md)
