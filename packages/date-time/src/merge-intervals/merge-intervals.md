# `mergeIntervals`

Returns the sorted union of intervals, with overlaps joined.

## Import

```ts
import { mergeIntervals } from "@sgx4u/date-time";
```

## Signature

```ts
function mergeIntervals(
    intervals: readonly Interval[],
    options?: MergeIntervalsOptions,
): Interval[];
```

## Options

| Name            | Type      | Default | Meaning                                            |
| --------------- | --------- | ------- | -------------------------------------------------- |
| `mergeTouching` | `boolean` | `true`  | Whether `[a, b)` and `[b, c)` become one interval. |

## Examples

```ts
import { mergeIntervals } from "@sgx4u/date-time";

mergeIntervals([
    { start: new Date(0), end: new Date(10) },
    { start: new Date(10), end: new Date(20) },
]).length;
// 1

mergeIntervals(
    [
        { start: new Date(0), end: new Date(10) },
        { start: new Date(10), end: new Date(20) },
    ],
    { mergeTouching: false },
).length;
// 2

mergeIntervals([
    { start: new Date(10), end: new Date(20) },
    { start: new Date(0), end: new Date(15) },
])[0]?.end.getTime();
// 20
```

## Edge cases

The input array is not reordered. The result is sorted by start. Empty intervals are kept only when they do not fall inside another interval. `intervals` must be an array. An invalid interval throws a `RangeError`.

## Related

- [`getIntervalGaps`](../get-interval-gaps/get-interval-gaps.md)
- [`getIntervalIntersection`](../get-interval-intersection/get-interval-intersection.md)
- [`isValidInterval`](../is-valid-interval/is-valid-interval.md)
