# `compareTimesOfDay`

Compares two times of day on a 24-hour clock.

## Import

```ts
import { compareTimesOfDay } from "@sgx4u/date-time";
```

## Signature

```ts
function compareTimesOfDay(
    params: CompareTimesOfDayParams,
): -1 | 0 | 1 | undefined;
```

## Options

| Name     | Type        | Required | Default | Meaning           |
| -------- | ----------- | -------- | ------- | ----------------- |
| `first`  | `TimeOfDay` | yes      |         | The first time.   |
| `second` | `TimeOfDay` | yes      |         | The second time.  |

## Examples

```ts
compareTimesOfDay({
    first: { hour: 9, minute: 0, second: 0, millisecond: 0 },
    second: { hour: 17, minute: 0, second: 0, millisecond: 0 },
});
// -1

compareTimesOfDay({
    first: { hour: 0, minute: 0, second: 0, millisecond: 0 },
    second: { hour: 23, minute: 59, second: 59, millisecond: 999 },
});
// -1
```

## Edge cases

The result is `-1` when `first` is earlier, `1` when it is later, and `0` when every field matches. Milliseconds count, so midnight is before `00:00:00.001`. A value that is not a time of day returns `undefined`.

## Related

- [`addToTimeOfDay`](../add-to-time-of-day/add-to-time-of-day.md) adds a duration to a time of day.
- [`isTimeOfDayInRange`](../is-time-of-day-in-range/is-time-of-day-in-range.md) tests membership in a daily range.