# `getHolidaysInYear`

Expands holiday rules for one Gregorian year.

## Import

```ts
import { getHolidaysInYear } from "@sgx4u/date-time";
```

## Signature

```ts
function getHolidaysInYear(
    year: number,
    rules: readonly HolidayRule[],
): Holiday[];
```

## Options

This function has no options.

## Examples

```ts
import { getHolidaysInYear } from "@sgx4u/date-time";

getHolidaysInYear(2026, [
    { name: "Christmas", date: { kind: "fixed", month: 12, day: 25 } },
]);
// [{ name: "Christmas", type: "public", date: { year: 2026, month: 12, day: 25 }, observedDate: { year: 2026, month: 12, day: 25 } }]

getHolidaysInYear(2026, [
    { name: "Christmas", date: { kind: "fixed", month: 12, day: 25 } },
    { name: "New Year", date: { kind: "fixed", month: 1, day: 1 } },
]).map((holiday) => holiday.name);
// ["New Year", "Christmas"]

getHolidaysInYear(2026, [
    { name: "Good Friday", date: { kind: "easter-offset", days: -2 } },
])[0]?.date;
// { year: 2026, month: 4, day: 3 }
```

## Edge cases

Results are sorted by the observed date. A rule's `type` defaults to `"public"` and `observed` defaults to `"none"`. A `"year-table"` rule with no entry for the year is skipped. An `"intl-calendar"` rule can match twice when that calendar date occurs twice in the Gregorian year. `rules` must be an array.

## Related

- [`getHoliday`](../get-holiday/get-holiday.md)
- [`isHoliday`](../is-holiday/is-holiday.md)
- [`getObservedDate`](../get-observed-date/get-observed-date.md)
