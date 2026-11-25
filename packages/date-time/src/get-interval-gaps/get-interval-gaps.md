# `getIntervalGaps`

See the TSDoc on `getIntervalGaps` for the contract.

## Import

```ts
import { getIntervalGaps } from "@sgx4u/date-time";
```

## Examples

Gaps are the uncovered time between sorted intervals. `divideInterval` splits a span into parts that differ by at most one millisecond.

## Edge cases

A part count that is not a positive integer throws `RangeError`. Empty gaps are omitted.

## Related

- [`mergeIntervals`](../merge-intervals/merge-intervals.md)
