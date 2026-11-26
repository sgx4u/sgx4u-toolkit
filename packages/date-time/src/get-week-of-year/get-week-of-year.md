# `getWeekOfYear`

Returns a locale-style week number.

## Import

```ts
import { getWeekOfYear } from "@sgx4u/date-time";
```

## Signature

```ts
function getWeekOfYear(params: GetWeekOfYearParams): number | undefined;
```

## Parameters

| Name                     | Type        | Required | Default                                  | Meaning                                                 |
| ------------------------ | ----------- | -------- | ---------------------------------------- | ------------------------------------------------------- |
| `date`                   | `DateInput` | yes      |                                          | The date to read.                                       |
| `minimumDaysInFirstWeek` | `number`    | no       | `1`                                      | How many days of the year the first week must contain.  |
| `timeZone`               | `string`    | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset      |
| `weekStartsOn`           | `Weekday`   | no       | `1`                                      | ISO weekday number that starts the week. `1` is Monday. |

## Examples

```ts
import { getWeekOfYear } from "@sgx4u/date-time";

getWeekOfYear({
    date: "2026-01-01T00:00:00Z",
    timeZone: "UTC",
    weekStartsOn: 1,
    minimumDaysInFirstWeek: 4,
});
// 1

getWeekOfYear({ date: "2023-01-01T00:00:00Z", timeZone: "UTC" });
// 1

getWeekOfYear({
    date: "2023-01-01T00:00:00Z",
    timeZone: "UTC",
    weekStartsOn: 1,
    minimumDaysInFirstWeek: 4,
});
// 52
```

## Edge cases

Week 1 is the first week, starting on `weekStartsOn`, that contains at least `minimumDaysInFirstWeek` days of the year. Monday and `4` match the ISO week. `minimumDaysInFirstWeek` outside 1 through 7 throws a `RangeError`.

## Related

- [`getISOWeek`](../get-iso-week/get-iso-week.md)
- [`getWeekOfMonth`](../get-week-of-month/get-week-of-month.md)
- [`getLocaleWeekInfo`](../get-locale-week-info/get-locale-week-info.md)
