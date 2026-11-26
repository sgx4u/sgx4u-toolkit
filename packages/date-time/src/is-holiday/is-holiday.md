# `isHoliday`

Reports whether a holiday rule falls on a date.

## Import

```ts
import { isHoliday } from "@sgx4u/date-time";
```

## Signature

```ts
function isHoliday(
    date: DateInput,
    rules: readonly HolidayRule[],
    options?: HolidayMatchOptions,
): boolean;
```

## Options

| Name                | Type      | Default                                 | Meaning                                                                    |
| ------------------- | --------- | --------------------------------------- | -------------------------------------------------------------------------- |
| `timeZone`          | `string`  | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`.       |
| `matchObservedDate` | `boolean` | `true`                                  | Match the observed substitute day. `false` matches only the original date. |

## Examples

```ts
import { isHoliday } from "@sgx4u/date-time";

isHoliday(
    "2026-12-25T00:00:00Z",
    [{ name: "Christmas", date: { kind: "fixed", month: 12, day: 25 } }],
    { timeZone: "UTC" },
);
// true

isHoliday(
    "2020-07-03T00:00:00Z",
    [
        {
            name: "Independence Day",
            date: { kind: "fixed", month: 7, day: 4 },
            observed: "nearest-weekday",
        },
    ],
    { timeZone: "UTC", matchObservedDate: false },
);
// false

isHoliday(
    "2020-07-04T00:00:00Z",
    [
        {
            name: "Independence Day",
            date: { kind: "fixed", month: 7, day: 4 },
            observed: "nearest-weekday",
        },
    ],
    { timeZone: "UTC", matchObservedDate: false },
);
// true
```

## Edge cases

This is `true` when `getHoliday` finds a holiday. The original date still matches when `matchObservedDate` is `false`. `rules` must be an array. The calendar day is read in `timeZone`.

## Related

- [`getHoliday`](../get-holiday/get-holiday.md)
- [`getHolidaysInYear`](../get-holidays-in-year/get-holidays-in-year.md)
- [`isBusinessDay`](../is-business-day/is-business-day.md)
