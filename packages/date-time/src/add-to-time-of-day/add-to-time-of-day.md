# `addToTimeOfDay`

Adds a duration to a time of day and reports how many calendar days the result crossed.

## Import

```ts
import { addToTimeOfDay } from "@sgx4u/date-time";
```

## Signature

```ts
function addToTimeOfDay(
    params: AddToTimeOfDayParams,
): { time: TimeOfDay; dayOffset: number } | undefined;
```

## Parameters

| Name       | Type        | Required | Default | Meaning                                                                 |
| ---------- | ----------- | -------- | ------- | ----------------------------------------------------------------------- |
| `time`     | `TimeOfDay` | yes      |         | The starting time.                                                      |
| `duration` | `Duration`  | yes      |         | The length to add. Clock fields may be fractional in the smallest unit. |

## Examples

```ts
addToTimeOfDay({
    time: { hour: 23, minute: 30, second: 0, millisecond: 0 },
    duration: { hours: 2 },
});
// { time: { hour: 1, minute: 30, second: 0, millisecond: 0 }, dayOffset: 1 }
```

## Edge cases

Months and years throw `RangeError` because a time of day has no calendar date. Weeks and days become part of `dayOffset`. A bad `time` or `duration` returns `undefined`. The wrap uses a 24-hour day of 86,400,000 milliseconds.

## Related

- [`formatTimeOfDay`](../format-time-of-day/format-time-of-day.md) writes the resulting time.
- [`compareTimesOfDay`](../compare-times-of-day/compare-times-of-day.md) orders two times of day.
