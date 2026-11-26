# `isWithinInterval`

Reports whether a date is inside a half-open interval.

## Import

```ts
import { isWithinInterval } from "@sgx4u/date-time";
```

## Signature

```ts
function isWithinInterval(date: DateInput, interval: Interval): boolean;
```

## Options

This function has no options.

## Examples

```ts
import { isWithinInterval } from "@sgx4u/date-time";

isWithinInterval("2026-01-01T12:00:00Z", {
    start: new Date("2026-01-01T00:00:00Z"),
    end: new Date("2026-01-02T00:00:00Z"),
});
// true

isWithinInterval("2026-01-01T00:00:00Z", {
    start: new Date("2026-01-01T00:00:00Z"),
    end: new Date("2026-01-02T00:00:00Z"),
});
// true

isWithinInterval("2026-01-02T00:00:00Z", {
    start: new Date("2026-01-01T00:00:00Z"),
    end: new Date("2026-01-02T00:00:00Z"),
});
// false
```

## Edge cases

The start is included and the end is excluded: `start <= date < end`. An interval whose end is before its start throws a `RangeError`.

## Related

- [`isValidInterval`](../is-valid-interval/is-valid-interval.md)
- [`getIntervalIntersection`](../get-interval-intersection/get-interval-intersection.md)
- [`isBetween`](../is-between/is-between.md)
