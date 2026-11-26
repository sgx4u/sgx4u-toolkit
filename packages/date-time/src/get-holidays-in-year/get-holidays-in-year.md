# `getHolidaysInYear`

Expands holiday rules for one Gregorian year.

## Import

```ts
import { getHolidaysInYear } from "@sgx4u/date-time";
```

## Signature

```ts
function getHolidaysInYear(
    params: GetHolidaysInYearParams,
): Holiday[] | undefined;
```

## Parameters

| Name    | Type                     | Required | Default | Meaning              |
| ------- | ------------------------ | -------- | ------- | -------------------- |
| `year`  | `number`                 | yes      |         | The Gregorian year.  |
| `rules` | `readonly HolidayRule[]` | yes      |         | The rules to expand. |

## Examples

```ts
import { getHolidaysInYear } from "@sgx4u/date-time";

getHolidaysInYear({
    year: 2026,
    rules: [{ name: "Christmas", date: { kind: "fixed", month: 12, day: 25 } }],
});
// [{ name: "Christmas", type: "public", date: { year: 2026, month: 12, day: 25 }, observedDate: { year: 2026, month: 12, day: 25 } }]

getHolidaysInYear({
    year: 2026,
    rules: [
        { name: "Christmas", date: { kind: "fixed", month: 12, day: 25 } },
        { name: "New Year", date: { kind: "fixed", month: 1, day: 1 } },
    ],
}).map((holiday) => holiday.name);
// ["New Year", "Christmas"]

getHolidaysInYear({
    year: 2026,
    rules: [{ name: "Good Friday", date: { kind: "easter-offset", days: -2 } }],
})[0]?.date;
// { year: 2026, month: 4, day: 3 }
```

## Edge cases

A non-integer `year` returns `undefined`. A non-array `rules` throws.

## Related

- [`getHoliday`](../get-holiday/get-holiday.md)
- [`isHoliday`](../is-holiday/is-holiday.md)
- [`getObservedDate`](../get-observed-date/get-observed-date.md)
