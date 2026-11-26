# `getIntervalIntersection`

Returns the shared part of two intervals.

## Import

```ts
import { getIntervalIntersection } from "@sgx4u/date-time";
```

## Signature

```ts
function getIntervalIntersection(params: GetIntervalIntersectionParams): Interval | undefined;
```

## Options

| Name     | Type       | Required | Default | Meaning           |
| -------- | ---------- | -------- | ------- | ----------------- |
| `first`  | `Interval` | Yes      | —       | First interval.   |
| `second` | `Interval` | Yes      | —       | Second interval.  |

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

No overlap returns `undefined`. Invalid intervals throw.


## Related

- [`isWithinInterval`](../is-within-interval/is-within-interval.md)
- [`mergeIntervals`](../merge-intervals/merge-intervals.md)
- [`getIntervalGaps`](../get-interval-gaps/get-interval-gaps.md)
