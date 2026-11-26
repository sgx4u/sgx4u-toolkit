# `isValidInterval`

Reports whether a value is a half-open interval.

## Import

```ts
import { isValidInterval } from "@sgx4u/date-time";
```

## Signature

```ts
function isValidInterval(value: unknown): value is Interval;
```

## Parameters

| Name    | Type      | Required | Default | Meaning    |
| ------- | --------- | -------- | ------- | ---------- |
| `value` | `unknown` | yes      |         | Any value. |

## Examples

```ts
import { isValidInterval } from "@sgx4u/date-time";

isValidInterval({ start: new Date(0), end: new Date(1) });
// true

isValidInterval({ start: new Date(0), end: new Date(0) });
// true

isValidInterval({ start: new Date(1), end: new Date(0) });
// false
```

## Edge cases

Both sides must be real dates, and `end` must not be before `start`. `start` equal to `end` is an empty interval and is valid. The function does not throw.

## Related

- [`isWithinInterval`](../is-within-interval/is-within-interval.md)
- [`getIntervalIntersection`](../get-interval-intersection/get-interval-intersection.md)
- [`mergeIntervals`](../merge-intervals/merge-intervals.md)
