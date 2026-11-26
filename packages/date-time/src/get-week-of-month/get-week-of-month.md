# `getWeekOfMonth`

Returns the week of the month, from 1 through 6.

## Import

```ts
import { getWeekOfMonth } from "@sgx4u/date-time";
```

## Signature

```ts
function getWeekOfMonth(
    date: DateInput,
    options?: TimeZoneOptions & WeekOptions,
): number;
```

## Options

| Name           | Type      | Default                                 | Meaning                                                              |
| -------------- | --------- | --------------------------------------- | -------------------------------------------------------------------- |
| `timeZone`     | `string`  | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`. |
| `weekStartsOn` | `Weekday` | `1`                                     | ISO weekday that starts the week. `1` is Monday and `7` is Sunday.   |

## Examples

```ts
import { getWeekOfMonth } from "@sgx4u/date-time";

getWeekOfMonth("2026-11-01T00:00:00Z", { timeZone: "UTC" });
// 1

getWeekOfMonth("2026-11-26T00:00:00Z", { timeZone: "UTC" });
// 5

getWeekOfMonth("2026-11-26T00:00:00Z", {
    timeZone: "UTC",
    weekStartsOn: 7,
});
// 4
```

## Edge cases

The first week is the week that contains day 1, using `weekStartsOn`. The default start is Monday. A value that is not a real date throws a `RangeError`.

## Related

- [`getWeekOfYear`](../get-week-of-year/get-week-of-year.md)
- [`getNthWeekdayOfMonth`](../get-nth-weekday-of-month/get-nth-weekday-of-month.md)
- [`getLocaleWeekInfo`](../get-locale-week-info/get-locale-week-info.md)
