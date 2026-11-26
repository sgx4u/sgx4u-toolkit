# `getIntervalGaps`

Returns the uncovered time between intervals.

## Import

```ts
import { getIntervalGaps } from "@sgx4u/date-time";
```

## Signature

```ts
function getIntervalGaps(
    intervals: readonly Interval[],
    within?: Interval,
): Interval[];
```

## Options

This function has no options.

## Examples

```ts
import { getIntervalGaps } from "@sgx4u/date-time";

getIntervalGaps([
    { start: new Date(0), end: new Date(5) },
    { start: new Date(10), end: new Date(15) },
]).map((gap) => [gap.start.getTime(), gap.end.getTime()]);
// [[5, 10]]

getIntervalGaps([{ start: new Date(5), end: new Date(10) }], {
    start: new Date(0),
    end: new Date(20),
}).map((gap) => [gap.start.getTime(), gap.end.getTime()]);
// [[0, 5], [10, 20]]

getIntervalGaps([
    { start: new Date(0), end: new Date(10) },
    { start: new Date(10), end: new Date(20) },
]).length;
// 0
```

## Edge cases

Without `within`, the result is the gaps between the sorted intervals and does not include time before the first or after the last. With `within`, the result is the part of that window the intervals do not cover. Empty gaps are omitted. Touching half-open intervals leave no gap. `intervals` must be an array, and an invalid interval throws.

## Related

- [`mergeIntervals`](../merge-intervals/merge-intervals.md)
- [`getIntervalIntersection`](../get-interval-intersection/get-interval-intersection.md)
- [`isWithinInterval`](../is-within-interval/is-within-interval.md)
