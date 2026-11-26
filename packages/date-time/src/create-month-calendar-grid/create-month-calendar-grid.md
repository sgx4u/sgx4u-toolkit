# `createMonthCalendarGrid`

Builds the weeks that cover one month, including leading and trailing days from the neighboring months.

## Import

```ts
import { createMonthCalendarGrid } from "@sgx4u/date-time";
```

## Signature

```ts
function createMonthCalendarGrid(
    params: CreateMonthCalendarGridParams,
): MonthCalendarGrid | undefined;
```

## Options

| Name             | Type      | Required | Default     | Meaning                                           |
| ---------------- | --------- | -------- | ----------- | ------------------------------------------------- |
| `year`           | `number`  | yes      |             | Gregorian year.                                   |
| `month`          | `number`  | yes      |             | Month from 1 through 12.                          |
| `timeZone`       | `string`  | no       | System zone | Zone used for the start of each day.              |
| `weekStartsOn`   | `Weekday` | no       | `1`         | ISO weekday that starts each week. `1` is Monday. |
| `fixedWeekCount` | `boolean` | no       | `false`     | When `true`, the grid always has six weeks.       |

## Examples

```ts
createMonthCalendarGrid({
    year: 2021,
    month: 2,
    timeZone: "UTC",
    weekStartsOn: 1,
})?.weeks.length;
// 4
```

## Edge cases

A non-integer `year` or `month` outside 1 through 12 returns `undefined`. An invalid `weekStartsOn` or unusable `timeZone` throws `RangeError`. Each day is the start of that calendar day in the zone. Neighboring-month cells have `isInMonth: false`.

## Related

- [`getDateParts`](../get-date-parts/get-date-parts.md) reads fields from a grid day.
- [`getISOWeek`](../get-iso-week/get-iso-week.md) reads the ISO week of a day.