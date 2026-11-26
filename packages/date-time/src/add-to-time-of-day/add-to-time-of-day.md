# `addToTimeOfDay`

Adds a duration to a time of day and reports how many calendar days the result crossed.

## Import

```ts
import { addToTimeOfDay } from "@sgx4u/date-time";
```

## Signature

```ts
function addToTimeOfDay(
    time: TimeOfDay,
    duration: Duration,
): { time: TimeOfDay; dayOffset: number };
```

## Options

This function has no options.

## Examples

```ts
addToTimeOfDay(
    { hour: 23, minute: 30, second: 0, millisecond: 0 },
    { hours: 2 },
);
// { time: { hour: 1, minute: 30, second: 0, millisecond: 0 }, dayOffset: 1 }

addToTimeOfDay(
    { hour: 1, minute: 30, second: 0, millisecond: 0 },
    { hours: -2 },
);
// { time: { hour: 23, minute: 30, second: 0, millisecond: 0 }, dayOffset: -1 }

addToTimeOfDay(
    { hour: 23, minute: 59, second: 59, millisecond: 500 },
    { milliseconds: 500 },
);
// { time: { hour: 0, minute: 0, second: 0, millisecond: 0 }, dayOffset: 1 }
```

## Edge cases

Months and years throw `RangeError` because a time of day has no calendar date. Weeks and days become part of `dayOffset`. A time that is not an object of finite numbers throws `TypeError`. The wrap uses a 24-hour day of 86,400,000 milliseconds.

## Related

- [`formatTimeOfDay`](../format-time-of-day/format-time-of-day.md) writes the resulting time.
- [`compareTimesOfDay`](../compare-times-of-day/compare-times-of-day.md) orders two times of day.
- [`getTimeOfDay`](../get-time-of-day/get-time-of-day.md) reads the time of day from an instant.
