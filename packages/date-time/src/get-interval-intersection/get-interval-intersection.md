# `getIntervalIntersection`

Returns the shared part of two intervals.

## Import

```ts
import { getIntervalIntersection } from "@sgx4u/date-time";
```

## Signature

```ts
function getIntervalIntersection(
    first: Interval,
    second: Interval,
): Interval | undefined;
```

## Options

This function has no options.

## Examples

```ts
import { getIntervalIntersection } from "@sgx4u/date-time";

getIntervalIntersection(
    { start: new Date(0), end: new Date(10) },
    { start: new Date(5), end: new Date(15) },
)?.start.getTime();
// 5

getIntervalIntersection(
    { start: new Date(0), end: new Date(10) },
    { start: new Date(5), end: new Date(15) },
)?.end.getTime();
// 10

getIntervalIntersection(
    { start: new Date(0), end: new Date(5) },
    { start: new Date(5), end: new Date(10) },
);
// undefined
```

## Edge cases

Intervals are half-open, so a shared endpoint is not an overlap and the result is `undefined`. An interval whose end is before its start throws a `RangeError`.

## Related

- [`isWithinInterval`](../is-within-interval/is-within-interval.md)
- [`mergeIntervals`](../merge-intervals/merge-intervals.md)
- [`getIntervalGaps`](../get-interval-gaps/get-interval-gaps.md)
