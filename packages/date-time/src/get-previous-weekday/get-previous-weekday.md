# `getPreviousWeekday`

Returns the start of the previous day that falls on a weekday.

## Import

```ts
import { getPreviousWeekday } from "@sgx4u/date-time";
```

## Signature

```ts
function getPreviousWeekday(
    date: DateInput,
    weekday: Weekday,
    options?: WeekdayStepOptions,
): Date;
```

## Options

| Name                | Type      | Default                                 | Meaning                                                                         |
| ------------------- | --------- | --------------------------------------- | ------------------------------------------------------------------------------- |
| `timeZone`          | `string`  | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`.            |
| `includeCurrentDay` | `boolean` | `false`                                 | When `true`, a date that is already that weekday returns the start of that day. |

## Examples

```ts
import { getPreviousWeekday } from "@sgx4u/date-time";

getPreviousWeekday("2026-11-26T15:00:00Z", 1, {
    timeZone: "UTC",
}).toISOString();
// "2026-11-23T00:00:00.000Z"

getPreviousWeekday("2026-11-26T15:00:00Z", 4, {
    timeZone: "UTC",
}).toISOString();
// "2026-11-19T00:00:00.000Z"

getPreviousWeekday("2026-11-26T15:00:00Z", 4, {
    timeZone: "UTC",
    includeCurrentDay: true,
}).toISOString();
// "2026-11-26T00:00:00.000Z"
```

## Edge cases

`weekday` is an ISO number, Monday `1` through Sunday `7`. The current day is skipped unless `includeCurrentDay` is `true`. The result is the start of that day in `timeZone`. An out-of-range weekday throws a `RangeError`.

## Related

- [`getNextWeekday`](../get-next-weekday/get-next-weekday.md)
- [`getNthWeekdayOfMonth`](../get-nth-weekday-of-month/get-nth-weekday-of-month.md)
- [`getPreviousBusinessDay`](../get-previous-business-day/get-previous-business-day.md)
