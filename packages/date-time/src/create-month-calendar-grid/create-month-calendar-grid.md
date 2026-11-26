# `createMonthCalendarGrid`

Builds the weeks that cover one month, including leading and trailing days from the neighboring months.

## Import

```ts
import { createMonthCalendarGrid } from "@sgx4u/date-time";
```

## Signature

```ts
function createMonthCalendarGrid(
    year: number,
    month: number,
    options?: MonthCalendarOptions,
): MonthCalendarGrid;
```

## Options

| Name             | Type      | Default     | Meaning                                           |
| ---------------- | --------- | ----------- | ------------------------------------------------- |
| `timeZone`       | `string`  | System zone | Zone used for the start of each day.              |
| `weekStartsOn`   | `Weekday` | `1`         | ISO weekday that starts each week. `1` is Monday. |
| `fixedWeekCount` | `boolean` | `false`     | When `true`, the grid always has six weeks.       |

## Examples

```ts
createMonthCalendarGrid(2021, 2, { timeZone: "UTC", weekStartsOn: 1 }).weeks
    .length;
// 4

createMonthCalendarGrid(2024, 2, { timeZone: "UTC" }).weeks.length;
// 5

createMonthCalendarGrid(2024, 2, { timeZone: "UTC", fixedWeekCount: true })
    .weeks.length;
// 6
```

February 2021 starts on a Monday, so the first cell is 1 February. February 2024 starts on a Thursday, so the first cell is 29 January and `isInMonth` is `false` for that day. 29 February 2024 is in the month.

## Edge cases

`month` outside `1` through `12` throws `RangeError`. A non-integer year or month throws `RangeError`. Each `date` is midnight at the start of that calendar day in the zone. In `Asia/Kolkata`, the last in-month day of February 2024 is `2024-02-28T18:30:00.000Z`.

## Related

- [`getDaysInMonth`](../get-days-in-month/get-days-in-month.md) returns how many days the month has.
- [`getWeekdayNames`](../get-weekday-names/get-weekday-names.md) returns localized weekday names.
