# `getIntervalDuration`

Returns the length of an interval as a duration.

## Import

```ts
import { getIntervalDuration } from "@sgx4u/date-time";
```

## Signature

```ts
function getIntervalDuration(
    params: GetIntervalDurationParams,
): Duration | undefined;
```

## Parameters

| Name          | Type       | Required | Default                                  | Meaning                                            |
| ------------- | ---------- | -------- | ---------------------------------------- | -------------------------------------------------- |
| `interval`    | `Interval` | yes      |                                          | The half-open interval.                            |
| `largestUnit` | `TimeUnit` | no       | `"day"`                                  | The largest unit in the result.                    |
| `timeZone`    | `string`   | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset |

## Examples

```ts
import { getIntervalDuration } from "@sgx4u/date-time";

getIntervalDuration({
    interval: {
        start: new Date(0),
        end: new Date(90 * 60 * 1000),
    },
});
// { hours: 1, minutes: 30 }

getIntervalDuration({
    interval: {
        start: new Date("2026-01-01T00:00:00Z"),
        end: new Date("2026-01-03T00:00:00Z"),
    },
    timeZone: "UTC",
});
// { days: 2 }

getIntervalDuration({
    interval: {
        start: new Date("2026-01-01T00:00:00Z"),
        end: new Date("2026-01-03T00:00:00Z"),
    },
    timeZone: "UTC",
    largestUnit: "hour",
});
// { hours: 48 }
```

## Edge cases

An invalid `interval` returns `undefined`. Unknown `largestUnit` or invalid `timeZone` throws.

## Related

- [`getIntervalGaps`](../get-interval-gaps/get-interval-gaps.md)
- [`millisecondsToDuration`](../milliseconds-to-duration/milliseconds-to-duration.md)
- [`listDatesInInterval`](../list-dates-in-interval/list-dates-in-interval.md)
