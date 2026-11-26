# `getWeekOfYear`

Returns a locale-style week number.

## Import

```ts
import { getWeekOfYear } from "@sgx4u/date-time";
```

## Signature

```ts
function getWeekOfYear(date: DateInput, options?: WeekOfYearOptions): number;
```

## Options

| Name                     | Type      | Default                                 | Meaning                                                              |
| ------------------------ | --------- | --------------------------------------- | -------------------------------------------------------------------- |
| `timeZone`               | `string`  | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`. |
| `weekStartsOn`           | `Weekday` | `1`                                     | ISO weekday that starts the week. `1` is Monday and `7` is Sunday.   |
| `minimumDaysInFirstWeek` | `number`  | `1`                                     | How many days of the year the first week must contain.               |

## Examples

```ts
import { getWeekOfYear } from "@sgx4u/date-time";

getWeekOfYear("2026-01-01T00:00:00Z", {
    timeZone: "UTC",
    weekStartsOn: 1,
    minimumDaysInFirstWeek: 4,
});
// 1

getWeekOfYear("2023-01-01T00:00:00Z", { timeZone: "UTC" });
// 1

getWeekOfYear("2023-01-01T00:00:00Z", {
    timeZone: "UTC",
    weekStartsOn: 1,
    minimumDaysInFirstWeek: 4,
});
// 52
```

## Edge cases

Week 1 is the first week, starting on `weekStartsOn`, that contains at least `minimumDaysInFirstWeek` days of the year. Monday and `4` match the ISO week. `minimumDaysInFirstWeek` outside 1 through 7 throws a `RangeError`.

## Related

- [`getIsoWeek`](../get-iso-week/get-iso-week.md)
- [`getWeekOfMonth`](../get-week-of-month/get-week-of-month.md)
- [`getLocaleWeekInfo`](../get-locale-week-info/get-locale-week-info.md)
