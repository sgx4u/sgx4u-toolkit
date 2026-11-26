# `listDatesInInterval`

Lists the dates inside an interval.

## Import

```ts
import { listDatesInInterval } from "@sgx4u/date-time";
```

## Signature

```ts
function listDatesInInterval(
    interval: Interval,
    options?: ListDatesInIntervalOptions,
): Date[];
```

## Options

| Name           | Type       | Default                                 | Meaning                                                                                  |
| -------------- | ---------- | --------------------------------------- | ---------------------------------------------------------------------------------------- |
| `timeZone`     | `string`   | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`.                     |
| `weekStartsOn` | `Weekday`  | `1`                                     | ISO weekday that starts the week. `1` is Monday and `7` is Sunday.                       |
| `step`         | `Duration` | `{ days: 1 }`                           | The distance between dates.                                                              |
| `alignToUnit`  | `TimeUnit` | none                                    | When set, the first date is the first start of this unit at or after the interval start. |

## Examples

```ts
import { listDatesInInterval } from "@sgx4u/date-time";

listDatesInInterval(
    {
        start: new Date("2026-01-01T00:00:00Z"),
        end: new Date("2026-01-03T00:00:00Z"),
    },
    { timeZone: "UTC" },
).length;
// 2

listDatesInInterval(
    {
        start: new Date("2026-01-01T00:00:00Z"),
        end: new Date("2026-01-02T00:00:00Z"),
    },
    { step: { hours: 12 }, timeZone: "UTC" },
).map((date) => date.toISOString());
// ["2026-01-01T00:00:00.000Z", "2026-01-01T12:00:00.000Z"]

listDatesInInterval(
    {
        start: new Date("2026-01-01T10:00:00Z"),
        end: new Date("2026-01-03T00:00:00Z"),
    },
    { timeZone: "UTC", alignToUnit: "day" },
).map((date) => date.toISOString());
// ["2026-01-02T00:00:00.000Z"]
```

## Edge cases

The start is included and the end is excluded. With `alignToUnit`, a start that is already past the unit boundary waits for the next one. More than 100000 dates throws a `RangeError`. An empty interval returns an empty array.

## Related

- [`listBusinessDaysInInterval`](../list-business-days-in-interval/list-business-days-in-interval.md)
- [`getIntervalDuration`](../get-interval-duration/get-interval-duration.md)
- [`isWithinInterval`](../is-within-interval/is-within-interval.md)
