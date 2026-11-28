# `getIntervalIntersection`

Returns the shared part of two intervals.

## Import

```ts
import { getIntervalIntersection } from "@sgx4u/date-time";
```

## Signature

```ts
function getIntervalIntersection(
    params: GetIntervalIntersectionParams,
): Interval | undefined;
```

## Parameters

| Name     | Type       | Required | Default | Meaning              |
| -------- | ---------- | -------- | ------- | -------------------- |
| `first`  | `Interval` | yes      |         | The first interval.  |
| `second` | `Interval` | yes      |         | The second interval. |

## Examples

```ts
import { getIntervalIntersection } from "@sgx4u/date-time";

getIntervalIntersection({
    first: { start: new Date(0), end: new Date(10) },
    second: { start: new Date(5), end: new Date(15) },
})?.start.getTime();
// 5

getIntervalIntersection({
    first: { start: new Date(0), end: new Date(10) },
    second: { start: new Date(5), end: new Date(15) },
})?.end.getTime();
// 10

getIntervalIntersection({
    first: { start: new Date(0), end: new Date(5) },
    second: { start: new Date(5), end: new Date(10) },
});
// undefined
```

## Edge cases

No overlap returns `undefined`. Invalid intervals throw.

## Related

- [`isWithinInterval`](../is-within-interval/is-within-interval.md)
- [`mergeIntervals`](../merge-intervals/merge-intervals.md)
- [`getIntervalGaps`](../get-interval-gaps/get-interval-gaps.md)
