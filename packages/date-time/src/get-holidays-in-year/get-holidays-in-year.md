# `getHolidaysInYear`

Expands holiday rules for one Gregorian year.

## Import

```ts
import { getHolidaysInYear } from "@sgx4u/date-time";
```

## Signature

```ts
function getHolidaysInYear(params: GetHolidaysInYearParams): Holiday[] | undefined;
```

## Options

| Name    | Type                    | Required | Default | Meaning                 |
| ------- | ----------------------- | -------- | ------- | ----------------------- |
| `year`  | `number`                | Yes      | —       | Gregorian year.         |
| `rules` | `readonly HolidayRule[]`| Yes      | —       | Rules to expand.        |

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

A non-integer `year` returns `undefined`. A non-array `rules` throws.


## Related

- [`getHoliday`](../get-holiday/get-holiday.md)
- [`isHoliday`](../is-holiday/is-holiday.md)
- [`getObservedDate`](../get-observed-date/get-observed-date.md)
