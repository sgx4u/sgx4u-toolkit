# `roundDuration`

Rounds a duration to a unit.

## Import

```ts
import { roundDuration } from "@sgx4u/date-time";
```

## Signature

```ts
function roundDuration(
    duration: Duration,
    options: RoundDurationOptions,
): Duration;
```

## Options

| Name           | Type                          | Default     | Meaning                                                                                |
| -------------- | ----------------------------- | ----------- | -------------------------------------------------------------------------------------- |
| `smallestUnit` | `TimeUnit`                    | required    | Unit the result is rounded to.                                                         |
| `mode`         | `"nearest" \| "down" \| "up"` | `"nearest"` | `"nearest"` rounds half away from zero. `"down"` moves toward zero. `"up"` moves away. |
| `relativeTo`   | `DateInput`                   | none        | Instant used to measure a month, a quarter, or a year.                                 |
| `timeZone`     | `string`                      | System zone | Zone used with `relativeTo`.                                                           |

## Examples

```ts
roundDuration({ minutes: 90 }, { smallestUnit: "hour" });
// { hours: 2 }

roundDuration({ minutes: 20 }, { smallestUnit: "hour", mode: "down" });
// {}

roundDuration({ minutes: 20 }, { smallestUnit: "hour", mode: "up" });
// { hours: 1 }

roundDuration({ minutes: -90 }, { smallestUnit: "hour" });
// { hours: -2 }
```

## Edge cases

A result of zero is `{}`. A negative duration keeps its sign. Clock units and weeks use fixed lengths: a day is 24 hours and a week is 7 of those days. `smallestUnit` of `"year"`, `"quarter"`, or `"month"` needs `relativeTo`, and a missing one throws `RangeError`. An unknown `mode` throws `RangeError`.

When `relativeTo` is set, months and years use the length of one unit starting at that instant in `timeZone`. A daylight-saving transition inside that month or year changes the millisecond length used for the rounding.

## Related

- [`roundToUnit`](../round-to-unit/round-to-unit.md) rounds a date to a unit increment.
- [`durationToMilliseconds`](../duration-to-milliseconds/duration-to-milliseconds.md) measures a duration from an instant.
- [`normalizeDuration`](../normalize-duration/normalize-duration.md) balances a duration into larger units.
