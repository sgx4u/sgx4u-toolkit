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

## Parameters

| Name             | Type      | Required | Default                                  | Meaning                                                 |
| ---------------- | --------- | -------- | ---------------------------------------- | ------------------------------------------------------- |
| `year`           | `number`  | yes      |                                          | The Gregorian year.                                     |
| `month`          | `number`  | yes      |                                          | The month, from 1 through 12.                           |
| `fixedWeekCount` | `boolean` | no       | `false`                                  | Whether the grid always has six weeks.                  |
| `timeZone`       | `string`  | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset      |
| `weekStartsOn`   | `Weekday` | no       | `1`                                      | ISO weekday number that starts the week. `1` is Monday. |

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
