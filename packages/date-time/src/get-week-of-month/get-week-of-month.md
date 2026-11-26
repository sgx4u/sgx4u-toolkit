# `getWeekOfMonth`

Returns the week of the month, from 1 through 6.

## Import

```ts
import { getWeekOfMonth } from "@sgx4u/date-time";
```

## Signature

```ts
function getWeekOfMonth(params: GetWeekOfMonthParams): number | undefined;
```

## Parameters

| Name           | Type        | Required | Default | Meaning                             |
| -------------- | ----------- | -------- | ------- | ----------------------------------- |
| `date`         | `DateInput` | yes      |         | The date to read.                   |
| `timeZone`     | `string`    | no       |         | Zone used to read the calendar day. |
| `weekStartsOn` | `Weekday`   | no       |         | ISO weekday that starts the week.   |

## Examples

```ts
import { getWeekOfMonth } from "@sgx4u/date-time";

getWeekOfMonth({ date: "2026-11-01T00:00:00Z", timeZone: "UTC" });
// 1

getWeekOfMonth({ date: "2026-11-26T00:00:00Z", timeZone: "UTC" });
// 5

getWeekOfMonth({
    date: "2026-11-26T00:00:00Z",
    timeZone: "UTC",
    weekStartsOn: 7,
});
// 4
```

## Edge cases

The first week is the week that contains day 1, using `weekStartsOn`. The default start is Monday. A value that is not a real date returns `undefined`.

## Related

- [`getWeekOfYear`](../get-week-of-year/get-week-of-year.md)
- [`getNthWeekdayOfMonth`](../get-nth-weekday-of-month/get-nth-weekday-of-month.md)
- [`getLocaleWeekInfo`](../get-locale-week-info/get-locale-week-info.md)
