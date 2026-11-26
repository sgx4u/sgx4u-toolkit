# `createInterval`

Builds a half-open interval `[start, end)`.

## Import

```ts
import { createInterval } from "@sgx4u/date-time";
```

## Signature

```ts
function createInterval(start: DateInput, end: DateInput): Interval;
```

## Options

This function has no options.

## Examples

```ts
const interval = createInterval("2026-01-01T00:00:00Z", "2026-01-02T00:00:00Z");
interval.start.toISOString(); // "2026-01-01T00:00:00.000Z"
interval.end.toISOString(); // "2026-01-02T00:00:00.000Z"

const empty = createInterval("2024-02-29T00:00:00Z", "2024-02-29T00:00:00Z");
empty.start.getTime() === empty.end.getTime(); // true
```

## Edge cases

`start` equal to `end` is empty and valid. `end` before `start` throws `RangeError`. A value that is not a real date throws `RangeError`. The returned `Date` objects are new; the inputs are not mutated.

## Related

- [`isValidInterval`](../is-valid-interval/is-valid-interval.md) reports whether an interval is usable.
- [`isWithinInterval`](../is-within-interval/is-within-interval.md) tests an instant against `[start, end)`.
- [`doIntervalsOverlap`](../do-intervals-overlap/do-intervals-overlap.md) reports whether two intervals overlap.
