# `isWithinInterval`

Reports whether a date is inside a half-open interval.

## Import

```ts
import { isWithinInterval } from "@sgx4u/date-time";
```

## Signature

```ts
function isWithinInterval(params: IsWithinIntervalParams): boolean;
```

## Parameters

| Name       | Type        | Required | Default | Meaning                 |
| ---------- | ----------- | -------- | ------- | ----------------------- |
| `date`     | `DateInput` | yes      |         | The date to test.       |
| `interval` | `Interval`  | yes      |         | The half-open interval. |

## Examples

```ts
import { isWithinInterval } from "@sgx4u/date-time";

isWithinInterval({
    date: "2026-01-01T12:00:00Z",
    interval: {
        start: new Date("2026-01-01T00:00:00Z"),
        end: new Date("2026-01-02T00:00:00Z"),
    },
});
// true

isWithinInterval({
    date: "2026-01-01T00:00:00Z",
    interval: {
        start: new Date("2026-01-01T00:00:00Z"),
        end: new Date("2026-01-02T00:00:00Z"),
    },
});
// true

isWithinInterval({
    date: "2026-01-02T00:00:00Z",
    interval: {
        start: new Date("2026-01-01T00:00:00Z"),
        end: new Date("2026-01-02T00:00:00Z"),
    },
});
// false
```

## Edge cases

The start is included and the end is excluded: `start <= date < end`. An interval whose end is before its start throws a `RangeError`.

## Related

- [`isValidInterval`](../is-valid-interval/is-valid-interval.md)
- [`getIntervalIntersection`](../get-interval-intersection/get-interval-intersection.md)
- [`isBetween`](../is-between/is-between.md)
