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

## Parameters

| Name                | Type                     | Required | Default                                  | Meaning                                                                        |
| ------------------- | ------------------------ | -------- | ---------------------------------------- | ------------------------------------------------------------------------------ |
| `date`              | `DateInput`              | yes      |                                          | The date to test.                                                              |
| `rules`             | `readonly HolidayRule[]` | yes      |                                          | The holiday rules.                                                             |
| `matchObservedDate` | `boolean`                | no       | `true`                                   | Match the observed substitute day. When false, only the original date matches. |
| `timeZone`          | `string`                 | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset                             |

## Examples

```ts
import { getHoliday } from "@sgx4u/date-time";

getHoliday({
    date: "2020-07-03T00:00:00Z",
    rules: [
        {
            name: "Independence Day",
            date: { kind: "fixed", month: 7, day: 4 },
            observed: "nearest-weekday",
        },
    ],
    timeZone: "UTC",
})?.name;
// "Independence Day"

getHoliday({
    date: "2020-07-03T00:00:00Z",
    rules: [
        {
            name: "Independence Day",
            date: { kind: "fixed", month: 7, day: 4 },
            observed: "nearest-weekday",
        },
    ],
    timeZone: "UTC",
    matchObservedDate: false,
})?.name;
// undefined

getHoliday({
    date: "2026-04-03T00:00:00Z",
    rules: [{ name: "Good Friday", date: { kind: "easter-offset", days: -2 } }],
    timeZone: "UTC",
})?.name;
// "Good Friday"
```

## Edge cases

Not a holiday returns `undefined`. A non-array `rules` throws. A bad `date` or invalid `timeZone` throws.

## Related

- [`isHoliday`](../is-holiday/is-holiday.md)
- [`getHolidaysInYear`](../get-holidays-in-year/get-holidays-in-year.md)
- [`getObservedDate`](../get-observed-date/get-observed-date.md)
