# `differenceAsDuration`

Breaks the distance from `earlier` to `later` into a duration.

## Import

```ts
import { differenceAsDuration } from "@sgx4u/date-time";
```

## Signature

```ts
function differenceAsDuration(
    params: DifferenceAsDurationParams,
): Duration | undefined;
```

## Parameters

| Name           | Type        | Required | Default                                  | Meaning                                                                |
| -------------- | ----------- | -------- | ---------------------------------------- | ---------------------------------------------------------------------- |
| `later`        | `DateInput` | yes      |                                          | The end instant.                                                       |
| `earlier`      | `DateInput` | yes      |                                          | The start instant.                                                     |
| `largestUnit`  | `TimeUnit`  | no       | `"year"`                                 | The largest unit in the result.                                        |
| `smallestUnit` | `TimeUnit`  | no       | `"millisecond"`                          | The smallest unit in the result. A clock unit may be fractional so the |
| `timeZone`     | `string`    | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset                     |

## Examples

```ts
differenceAsDuration({
    later: "2026-01-01T01:00:00Z",
    earlier: "2026-01-01T00:00:00Z",
    timeZone: "UTC",
});
// { hours: 1 }

differenceAsDuration({
    later: "2025-03-01T00:00:00Z",
    earlier: "2024-02-29T00:00:00Z",
    timeZone: "UTC",
});
// { years: 1, days: 1 }

differenceAsDuration({
    later: "2025-01-01T12:00:00Z",
    earlier: "2024-12-31T00:00:00Z",
    timeZone: "UTC",
    largestUnit: "day",
});
// { days: 1, hours: 12 }

differenceAsDuration({
    later: "2024-03-10T08:00:00Z",
    earlier: "2024-03-10T06:00:00Z",
    timeZone: "America/New_York",
    largestUnit: "hour",
});
// { hours: 2 }
```

## Edge cases

Zero fields are omitted. Adding the result to `earlier` with `addDuration` in the same zone returns `later` when `smallestUnit` is `"millisecond"`. `smallestUnit` larger than `largestUnit` throws `RangeError`. A date that is not usable returns `undefined`. The New York spring-forward morning from 01:00 to 03:00 wall time is still two elapsed hours.

## Related

- [`addDuration`](../add-duration/add-duration.md) adds this duration back onto a date.
- [`differenceInUnit`](../difference-in-unit/difference-in-unit.md) counts whole units between two instants.
- [`formatDuration`](../format-duration/format-duration.md) writes the duration as text.
