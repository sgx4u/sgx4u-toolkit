# `compareTimesOfDay`

Compares two times of day by milliseconds since midnight.

## Import

```ts
import { compareTimesOfDay } from "@sgx4u/date-time";
```

## Signature

```ts
function compareTimesOfDay(first: TimeOfDay, second: TimeOfDay): -1 | 0 | 1;
```

## Options

This function has no options.

## Examples

```ts
compareTimesOfDay(
    { hour: 9, minute: 0, second: 0, millisecond: 0 },
    { hour: 17, minute: 0, second: 0, millisecond: 0 },
);
// -1

compareTimesOfDay(
    { hour: 17, minute: 0, second: 0, millisecond: 0 },
    { hour: 9, minute: 0, second: 0, millisecond: 0 },
);
// 1

compareTimesOfDay(
    { hour: 9, minute: 0, second: 0, millisecond: 0 },
    { hour: 9, minute: 0, second: 0, millisecond: 0 },
);
// 0
```

## Edge cases

The result is `-1` when `first` is earlier, `1` when it is later, and `0` when the times match. A value that is not an object throws `TypeError`. The comparison has no date and no time zone, so it does not apply daylight-saving rules.

## Related

- [`isTimeOfDayInRange`](../is-time-of-day-in-range/is-time-of-day-in-range.md) tests a daily window.
- [`addToTimeOfDay`](../add-to-time-of-day/add-to-time-of-day.md) adds a duration and wraps past midnight.
- [`parseTimeOfDay`](../parse-time-of-day/parse-time-of-day.md) reads a clock string.
