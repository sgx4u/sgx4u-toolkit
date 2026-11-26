# `doIntervalsOverlap`

Reports whether two half-open intervals overlap.

## Import

```ts
import { doIntervalsOverlap } from "@sgx4u/date-time";
```

## Signature

```ts
function doIntervalsOverlap(
    first: Interval,
    second: Interval,
    options?: DoIntervalsOverlapOptions,
): boolean;
```

## Options

| Name                     | Type      | Default | Meaning                                |
| ------------------------ | --------- | ------- | -------------------------------------- |
| `countTouchingAsOverlap` | `boolean` | `false` | Whether `[a, b)` and `[b, c)` overlap. |

## Examples

```ts
doIntervalsOverlap(
    { start: new Date(0), end: new Date(10) },
    { start: new Date(10), end: new Date(20) },
);
// false

doIntervalsOverlap(
    { start: new Date(0), end: new Date(10) },
    { start: new Date(10), end: new Date(20) },
    { countTouchingAsOverlap: true },
);
// true

const leapDay = {
    start: new Date("2024-02-29T00:00:00Z"),
    end: new Date("2024-03-01T00:00:00Z"),
};
const march = {
    start: new Date("2024-02-29T12:00:00Z"),
    end: new Date("2024-03-02T00:00:00Z"),
};
doIntervalsOverlap(leapDay, march);
// true
```

## Edge cases

Intervals that only share an endpoint do not overlap unless `countTouchingAsOverlap` is `true`. An interval overlaps itself. An invalid interval throws `RangeError`.

## Related

- [`getIntervalIntersection`](../get-interval-intersection/get-interval-intersection.md) returns the overlapping range.
- [`mergeIntervals`](../merge-intervals/merge-intervals.md) joins overlapping intervals.
- [`isWithinInterval`](../is-within-interval/is-within-interval.md) tests one instant against an interval.
