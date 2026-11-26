# `differenceInUnit`

Counts whole units from `earlier` to `later`.

## Import

```ts
import { differenceInUnit } from "@sgx4u/date-time";
```

## Signature

```ts
function differenceInUnit(params: DifferenceInUnitParams): number | undefined;
```

## Parameters

| Name       | Type           | Required | Default                                  | Meaning                                            |
| ---------- | -------------- | -------- | ---------------------------------------- | -------------------------------------------------- |
| `later`    | `DateInput`    | yes      |                                          | The end instant.                                   |
| `earlier`  | `DateInput`    | yes      |                                          | The start instant.                                 |
| `unit`     | `TimeUnit`     | yes      |                                          | The unit to count.                                 |
| `rounding` | `RoundingMode` | no       | `"truncate"`                             | How to treat a fractional unit count.              |
| `timeZone` | `string`       | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset |

## Examples

```ts
differenceInUnit({
    later: "2026-03-01T00:00:00Z",
    earlier: "2026-01-31T00:00:00Z",
    unit: "month",
    timeZone: "UTC",
});
// 1

differenceInUnit({
    later: "2026-01-01T01:30:00Z",
    earlier: "2026-01-01T00:00:00Z",
    unit: "hour",
    timeZone: "UTC",
    rounding: "round",
});
// 2

differenceInUnit({
    later: "2024-03-01T00:00:00Z",
    earlier: "2024-02-28T00:00:00Z",
    unit: "day",
    timeZone: "UTC",
});
// 2

differenceInUnit({
    later: "2025-02-28T00:00:00Z",
    earlier: "2024-02-29T00:00:00Z",
    unit: "year",
    timeZone: "UTC",
});
// 1
```

## Edge cases

A date that is not usable returns `undefined`. Calendar units use the largest count that, added to `earlier`, does not pass `later`. Clock units divide the elapsed milliseconds. The result is negative when `later` is before `earlier`. An unknown `rounding` An unknown `unit`, `rounding`, or `timeZone` throws `RangeError`. 28 February 2024 to 1 March 2024 is two calendar days because 2024 is a leap year.

## Related

- [`differenceInCalendarUnit`](../difference-in-calendar-unit/difference-in-calendar-unit.md) counts boundaries crossed, not whole units that fit.
- [`differenceAsDuration`](../difference-as-duration/difference-as-duration.md) returns the distance as a duration.
