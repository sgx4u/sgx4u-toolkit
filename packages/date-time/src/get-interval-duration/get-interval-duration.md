# `getIntervalDuration`

Returns the length of an interval as a duration.

## Import

```ts
import { getIntervalDuration } from "@sgx4u/date-time";
```

## Signature

```ts
function getIntervalDuration(
    interval: Interval,
    options?: IntervalDurationOptions,
): Duration;
```

## Options

| Name          | Type       | Default                                 | Meaning                                                                            |
| ------------- | ---------- | --------------------------------------- | ---------------------------------------------------------------------------------- |
| `largestUnit` | `TimeUnit` | `"day"`                                 | Largest unit in the result. Smaller non-zero fields are kept down to milliseconds. |
| `timeZone`    | `string`   | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`.               |

## Examples

```ts
import { getIntervalDuration } from "@sgx4u/date-time";

getIntervalDuration({
    start: new Date(0),
    end: new Date(90 * 60 * 1000),
});
// { hours: 1, minutes: 30 }

getIntervalDuration(
    {
        start: new Date("2026-01-01T00:00:00Z"),
        end: new Date("2026-01-03T00:00:00Z"),
    },
    { timeZone: "UTC" },
);
// { days: 2 }

getIntervalDuration(
    {
        start: new Date("2026-01-01T00:00:00Z"),
        end: new Date("2026-01-03T00:00:00Z"),
    },
    { timeZone: "UTC", largestUnit: "hour" },
);
// { hours: 48 }
```

## Edge cases

Adding the result to `start` in the same zone reaches `end` when the smallest unit is a millisecond. Zero fields are omitted. An interval whose end is before its start throws a `RangeError`. `largestUnit` must be a time unit.

## Related

- [`getIntervalGaps`](../get-interval-gaps/get-interval-gaps.md)
- [`millisecondsToDuration`](../milliseconds-to-duration/milliseconds-to-duration.md)
- [`listDatesInInterval`](../list-dates-in-interval/list-dates-in-interval.md)
