# `getNextWeekday`

Returns the start of the next day that falls on a weekday.

## Import

```ts
import { getNextWeekday } from "@sgx4u/date-time";
```

## Signature

```ts
function getNextWeekday(params: GetNextWeekdayParams): Date | undefined;
```

## Parameters

| Name                | Type        | Required | Default                                  | Meaning                                                                         |
| ------------------- | ----------- | -------- | ---------------------------------------- | ------------------------------------------------------------------------------- |
| `date`              | `DateInput` | yes      |                                          | The date to step from.                                                          |
| `weekday`           | `Weekday`   | yes      |                                          | ISO weekday, Monday `1` through Sunday `7`.                                     |
| `includeCurrentDay` | `boolean`   | no       | `false`                                  | When `true`, a date that is already that weekday returns the start of that day. |
| `timeZone`          | `string`    | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset                              |

## Examples

```ts
import { getNextWeekday } from "@sgx4u/date-time";

getNextWeekday({
    date: "2026-11-26T15:00:00Z",
    weekday: 1,
    timeZone: "UTC",
}).toISOString();
// "2026-11-30T00:00:00.000Z"

getNextWeekday({
    date: "2026-11-26T15:00:00Z",
    weekday: 4,
    timeZone: "UTC",
}).toISOString();
// "2026-12-03T00:00:00.000Z"

getNextWeekday({
    date: "2026-11-26T15:00:00Z",
    weekday: 4,
    timeZone: "UTC",
    includeCurrentDay: true,
}).toISOString();
// "2026-11-26T00:00:00.000Z"
```

## Edge cases

`weekday` is an ISO number, Monday `1` through Sunday `7`. The current day is skipped unless `includeCurrentDay` is `true`. The result is the start of that day in `timeZone`. An out-of-range weekday throws a `RangeError`.

## Related

- [`getPreviousWeekday`](../get-previous-weekday/get-previous-weekday.md)
- [`getNthWeekdayOfMonth`](../get-nth-weekday-of-month/get-nth-weekday-of-month.md)
- [`isWeekend`](../is-weekend/is-weekend.md)
