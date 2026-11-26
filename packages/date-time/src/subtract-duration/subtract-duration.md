# `subtractDuration`

Subtracts a duration from a date.

## Import

```ts
import { subtractDuration } from "@sgx4u/date-time";
```

## Signature

```ts
function subtractDuration(
    date: DateInput,
    duration: Duration,
    options?: AddDurationOptions,
): Date;
```

## Options

| Name             | Type                                               | Default        | Meaning                                                       |
| ---------------- | -------------------------------------------------- | -------------- | ------------------------------------------------------------- |
| `timeZone`       | `string`                                           | System zone    | Zone used for calendar units and daylight-saving gaps.        |
| `disambiguation` | `"compatible" \| "earlier" \| "later" \| "reject"` | `"compatible"` | How a skipped or repeated wall time is chosen.                |
| `overflow`       | `"constrain" \| "reject"`                          | `"constrain"`  | Clamps a missing day, or throws when that day does not exist. |

## Examples

```ts
subtractDuration(
    "2026-03-31T00:00:00Z",
    { months: 1 },
    {
        timeZone: "UTC",
    },
).toISOString();
// "2026-02-28T00:00:00.000Z"

subtractDuration(
    "2024-03-10T13:00:00Z",
    { days: 1 },
    {
        timeZone: "America/New_York",
    },
).toISOString();
// "2024-03-09T14:00:00.000Z"

subtractDuration(
    "2024-03-10T13:00:00Z",
    { hours: 24 },
    {
        timeZone: "America/New_York",
    },
).toISOString();
// "2024-03-09T13:00:00.000Z"
```

## Edge cases

This is `addDuration` with every field negated. Years and months move the wall clock, then weeks and days. March 31 minus one month is February 28 or 29. Hours and smaller units are elapsed time. A value of the wrong type throws `TypeError`. An invalid duration, a mixed sign, or an unknown option throws `RangeError`. `"reject"` throws when the resulting day does not exist or when it hits a gap or overlap.

A calendar day keeps the local clock time, so one day across the 2024 spring-forward in `America/New_York` is 23 hours. Twenty-four hours is elapsed time and stays 24 hours. `"compatible"` moves a skipped result forward by the gap and keeps the earlier instant of a repeated time.

## Related

- [`addDuration`](../add-duration/add-duration.md) adds a duration with the same options.
- [`negateDuration`](../negate-duration/negate-duration.md) flips the sign of every duration field.
- [`subtractIntervals`](../subtract-intervals/subtract-intervals.md) cuts one interval out of another.
