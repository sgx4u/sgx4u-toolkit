# `getNthWeekdayOfMonth`

Returns the start of the nth weekday in a month.

## Import

```ts
import { getNthWeekdayOfMonth } from "@sgx4u/date-time";
```

## Signature

```ts
function getNthWeekdayOfMonth(
    year: number,
    month: number,
    weekday: Weekday,
    occurrence: number,
    options?: TimeZoneOptions,
): Date | undefined;
```

## Options

| Name       | Type     | Default                                 | Meaning                                                              |
| ---------- | -------- | --------------------------------------- | -------------------------------------------------------------------- |
| `timeZone` | `string` | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`. |

## Examples

```ts
import { getNthWeekdayOfMonth } from "@sgx4u/date-time";

getNthWeekdayOfMonth(2026, 11, 4, 4, {
    timeZone: "UTC",
})?.toISOString();
// "2026-11-26T00:00:00.000Z"

getNthWeekdayOfMonth(2026, 2, 1, -1, {
    timeZone: "UTC",
})?.toISOString();
// "2026-02-23T00:00:00.000Z"

getNthWeekdayOfMonth(2026, 2, 1, 5, { timeZone: "UTC" });
// undefined
```

## Edge cases

`occurrence` `1` is the first and `-1` is the last. `5` is the fifth, which does not exist in every month and then returns `undefined`. `occurrence` must be an integer from 1 through 5 or from -5 through -1. `month` must be 1 through 12.

## Related

- [`getNextWeekday`](../get-next-weekday/get-next-weekday.md)
- [`getPreviousWeekday`](../get-previous-weekday/get-previous-weekday.md)
- [`getWeekOfMonth`](../get-week-of-month/get-week-of-month.md)
