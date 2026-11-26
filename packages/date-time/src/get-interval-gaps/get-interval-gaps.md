# `getIntervalGaps`

Returns the uncovered time between intervals.

## Import

```ts
import { getIntervalGaps } from "@sgx4u/date-time";
```

## Signature

```ts
function getIntervalGaps(params: GetIntervalGapsParams): Interval[] | undefined;
```

## Options

| Name        | Type                  | Required | Default | Meaning                              |
| ----------- | --------------------- | -------- | ------- | ------------------------------------ |
| `intervals` | `readonly Interval[]` | Yes      | —       | Covered intervals.                   |
| `within`    | `Interval`            | No       | —       | Optional window to measure inside.   |

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

An invalid interval in the list or in `within` returns `undefined`. A non-array `intervals` throws.


## Related

- [`mergeIntervals`](../merge-intervals/merge-intervals.md)
- [`getIntervalIntersection`](../get-interval-intersection/get-interval-intersection.md)
- [`isWithinInterval`](../is-within-interval/is-within-interval.md)
