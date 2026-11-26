# `divideInterval`

Splits an interval into equal parts that cover it in order.

## Import

```ts
import { divideInterval } from "@sgx4u/date-time";
```

## Signature

```ts
function divideInterval(interval: Interval, partCount: number): Interval[];
```

## Options

This function has no options.

## Examples

```ts
divideInterval({ start: new Date(0), end: new Date(10) }, 2).map((part) => [
    part.start.getTime(),
    part.end.getTime(),
]);
// [[0, 5], [5, 10]]

divideInterval({ start: new Date(0), end: new Date(10) }, 3).map((part) => [
    part.start.getTime(),
    part.end.getTime(),
]);
// [[0, 4], [4, 7], [7, 10]]
```

## Edge cases

Part lengths differ by at most one millisecond. Extra milliseconds go to the earlier parts. `partCount` must be a positive integer. `0` and `1.5` throw `RangeError`. A non-number throws `TypeError`. An invalid interval throws `RangeError`. An empty interval is split into empty parts.

## Related

- [`splitInterval`](../split-interval/split-interval.md) cuts an interval on a unit boundary.
- [`getIntervalDuration`](../get-interval-duration/get-interval-duration.md) returns the length of an interval.
