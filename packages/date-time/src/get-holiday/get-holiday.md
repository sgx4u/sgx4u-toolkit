# `getHoliday`

Returns the holiday that falls on a date, if any.

## Import

```ts
import { getHoliday } from "@sgx4u/date-time";
```

## Signature

```ts
function getHoliday(params: GetHolidayParams): Holiday | undefined;
```

## Options

| Name                | Type                    | Required | Default     | Meaning                                                                                                 |
| ------------------- | ----------------------- | -------- | ----------- | ------------------------------------------------------------------------------------------------------- |
| `date`              | `DateInput`             | Yes      | —           | The date to test.                                                                                       |
| `rules`             | `readonly HolidayRule[]`| Yes      | —           | Holiday rules to expand.                                                                                |
| `timeZone`          | `string`                | No       | System zone | Calendar day for matching.                                                                              |
| `matchObservedDate` | `boolean`               | No       | `true`      | Match the observed substitute day. When false, only the original date matches.                          |

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

Not a holiday returns `undefined`. A non-array `rules` throws. A bad `date` or invalid `timeZone` throws.


## Related

- [`isHoliday`](../is-holiday/is-holiday.md)
- [`getHolidaysInYear`](../get-holidays-in-year/get-holidays-in-year.md)
- [`getObservedDate`](../get-observed-date/get-observed-date.md)
