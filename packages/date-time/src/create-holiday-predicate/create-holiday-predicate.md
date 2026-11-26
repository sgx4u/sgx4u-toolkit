# `createHolidayPredicate`

Builds a holiday predicate that caches each year the first time it is asked.

## Import

```ts
import { createHolidayPredicate } from "@sgx4u/date-time";
```

## Signature

```ts
function createHolidayPredicate(
    rules: readonly HolidayRule[],
    options?: HolidayMatchOptions,
): (date: Date) => boolean;
```

## Options

| Name                | Type      | Default     | Meaning                                 |
| ------------------- | --------- | ----------- | --------------------------------------- |
| `timeZone`          | `string`  | System zone | Zone used to read the calendar day.     |
| `matchObservedDate` | `boolean` | `true`      | Also match the observed substitute day. |

## Examples

```ts
const isIndianHoliday = createHolidayPredicate(
    [{ name: "Republic Day", date: { kind: "fixed", month: 1, day: 26 } }],
    { timeZone: "Asia/Kolkata" },
);
isIndianHoliday(new Date("2026-01-25T18:30:00Z")); // true
isIndianHoliday(new Date("2026-01-25T18:29:59Z")); // false
```

`2026-01-25T18:30:00Z` is 26 January in `Asia/Kolkata`. One millisecond earlier is still 25 January.

## Edge cases

`rules` must be an array. Any other value throws `TypeError`. With `matchObservedDate: false`, only the official date matches. The predicate is suitable for `BusinessCalendar.holidays`.

## Related

- [`isHoliday`](../is-holiday/is-holiday.md) tests one date against a rule list.
- [`getHoliday`](../get-holiday/get-holiday.md) returns the holiday on a date.
- [`getHolidaysInYear`](../get-holidays-in-year/get-holidays-in-year.md) lists the holidays in one year.
