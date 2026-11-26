# `getHoliday`

Returns the holiday that falls on a date, if any.

## Import

```ts
import { getHoliday } from "@sgx4u/date-time";
```

## Signature

```ts
function getHoliday(
    date: DateInput,
    rules: readonly HolidayRule[],
    options?: HolidayMatchOptions,
): Holiday | undefined;
```

## Options

| Name                | Type      | Default                                 | Meaning                                                                                                 |
| ------------------- | --------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `timeZone`          | `string`  | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`.                                    |
| `matchObservedDate` | `boolean` | `true`                                  | Match the observed substitute day as well as the original date. `false` matches only the original date. |

## Examples

```ts
import { getHoliday } from "@sgx4u/date-time";

getHoliday(
    "2020-07-03T00:00:00Z",
    [
        {
            name: "Independence Day",
            date: { kind: "fixed", month: 7, day: 4 },
            observed: "nearest-weekday",
        },
    ],
    { timeZone: "UTC" },
)?.name;
// "Independence Day"

getHoliday(
    "2020-07-03T00:00:00Z",
    [
        {
            name: "Independence Day",
            date: { kind: "fixed", month: 7, day: 4 },
            observed: "nearest-weekday",
        },
    ],
    { timeZone: "UTC", matchObservedDate: false },
)?.name;
// undefined

getHoliday(
    "2026-04-03T00:00:00Z",
    [{ name: "Good Friday", date: { kind: "easter-offset", days: -2 } }],
    { timeZone: "UTC" },
)?.name;
// "Good Friday"
```

## Edge cases

Matching uses the calendar day in `timeZone`. The original date matches even when `matchObservedDate` is `false`. A day with no holiday returns `undefined`. `rules` must be an array. A `"year-table"` rule with no entry for that year does not match.

## Related

- [`isHoliday`](../is-holiday/is-holiday.md)
- [`getHolidaysInYear`](../get-holidays-in-year/get-holidays-in-year.md)
- [`getObservedDate`](../get-observed-date/get-observed-date.md)
