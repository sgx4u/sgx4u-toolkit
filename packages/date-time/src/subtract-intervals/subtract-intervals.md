# `subtractIntervals`

Returns the remaining pieces of an interval after other intervals are removed.

## Import

```ts
import { subtractIntervals } from "@sgx4u/date-time";
```

## Signature

```ts
function subtractIntervals(params: SubtractIntervalsParams): Interval[];
```

## Parameters

| Name      | Type                  | Required | Default | Meaning                                            |
| --------- | --------------------- | -------- | ------- | -------------------------------------------------- |
| `start`   | `DateInput`           | yes      |         | The inclusive start of the interval to cut.        |
| `end`     | `DateInput`           | yes      |         | The exclusive end of the interval to cut.          |
| `removed` | `readonly Interval[]` | yes      |         | Intervals to take away from `start` through `end`. |

## Examples

```ts
subtractIntervals({
    source: { start: new Date(0), end: new Date(10) },
    removed: [{ start: new Date(2), end: new Date(4) }],
});
// [
//   { start: new Date(0), end: new Date(2) },
//   { start: new Date(4), end: new Date(10) },
// ]

subtractIntervals({
    source: { start: new Date(0), end: new Date(10) },
    removed: [{ start: new Date(0), end: new Date(10) }],
});
// []

subtractIntervals({
    source: { start: new Date(0), end: new Date(10) },
    removed: [],
});
// [{ start: new Date(0), end: new Date(10) }]
```

## Edge cases

The pieces are sorted and half-open. Empty pieces are omitted. A removed interval that lies outside `source` leaves `source` whole. Overlapping removed intervals are merged before the cut. A value that is not an array throws `TypeError`. An invalid interval throws `RangeError`. Intervals are instants, so the cut follows absolute time across a daylight-saving change.

## Related

- [`mergeIntervals`](../merge-intervals/merge-intervals.md) joins overlapping intervals.
- [`getIntervalGaps`](../get-interval-gaps/get-interval-gaps.md) returns the uncovered time between intervals.
- [`getIntervalIntersection`](../get-interval-intersection/get-interval-intersection.md) returns the shared part of two intervals.
