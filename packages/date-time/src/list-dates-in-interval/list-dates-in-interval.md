# `listDatesInInterval`

Lists the dates inside an interval.

## Import

```ts
import { listDatesInInterval } from "@sgx4u/date-time";
```

## Signature

```ts
function listDatesInInterval(
    params: ListDatesInIntervalParams,
): Date[] | undefined;
```

## Parameters

| Name           | Type        | Required | Default                                  | Meaning                                                              |
| -------------- | ----------- | -------- | ---------------------------------------- | -------------------------------------------------------------------- |
| `start`        | `DateInput` | yes      |                                          | The inclusive start of the half-open interval.                       |
| `end`          | `DateInput` | yes      |                                          | The exclusive end of the half-open interval.                         |
| `step`         | `Duration`  | no       | `{ days: 1 }`                            | The distance between dates.                                          |
| `alignToUnit`  | `TimeUnit`  | no       |                                          | When set, the first date is the first start of this unit at or after |
| `timeZone`     | `string`    | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset                   |
| `weekStartsOn` | `Weekday`   | no       | `1`                                      | ISO weekday number that starts the week. `1` is Monday.              |

## Examples

```ts
import { listDatesInInterval } from "@sgx4u/date-time";

listDatesInInterval({
    interval: {
        start: new Date("2026-01-01T00:00:00Z"),
        end: new Date("2026-01-03T00:00:00Z"),
    },
    timeZone: "UTC",
}).length;
// 2

listDatesInInterval({
    interval: {
        start: new Date("2026-01-01T00:00:00Z"),
        end: new Date("2026-01-02T00:00:00Z"),
    },
    step: { hours: 12 },
    timeZone: "UTC",
}).map((date) => date.toISOString());
// ["2026-01-01T00:00:00.000Z", "2026-01-01T12:00:00.000Z"]

listDatesInInterval({
    interval: {
        start: new Date("2026-01-01T10:00:00Z"),
        end: new Date("2026-01-03T00:00:00Z"),
    },
    timeZone: "UTC",
    alignToUnit: "day",
}).map((date) => date.toISOString());
// ["2026-01-02T00:00:00.000Z"]
```

## Edge cases

The start is included and the end is excluded. With `alignToUnit`, a start that is already past the unit boundary waits for the next one. More than 100000 dates throws a `RangeError`. An empty interval returns an empty array.

## Related

- [`listBusinessDaysInInterval`](../list-business-days-in-interval/list-business-days-in-interval.md)
- [`getIntervalDuration`](../get-interval-duration/get-interval-duration.md)
- [`isWithinInterval`](../is-within-interval/is-within-interval.md)
