# `clampDate`

Limits a date to an inclusive range and returns a new `Date`.

## Import

```ts
import { clampDate } from "@sgx4u/date-time";
```

## Signature

```ts
function clampDate(
    date: DateInput,
    bounds: { start: DateInput; end: DateInput },
): Date;
```

## Options

This function has no options.

## Examples

```ts
clampDate("2024-01-10T00:00:00Z", {
    start: "2024-01-01T00:00:00Z",
    end: "2024-01-05T00:00:00Z",
}).toISOString();
// "2024-01-05T00:00:00.000Z"

clampDate("2024-01-03T00:00:00Z", {
    start: "2024-01-01T00:00:00Z",
    end: "2024-01-05T00:00:00Z",
}).toISOString();
// "2024-01-03T00:00:00.000Z"
```

## Edge cases

`start` after `end` throws `RangeError`. A value that is not a real date throws `RangeError`. A value of the wrong type throws `TypeError`. `bounds` must be an object. The inputs are not mutated. A date already inside the range is returned as its own instant.

## Related

- [`isWithinInterval`](../is-within-interval/is-within-interval.md) tests a half-open interval.
- [`compareDates`](../compare-dates/compare-dates.md) orders two instants.
- [`getEarliestDate`](../get-earliest-date/get-earliest-date.md) returns the earliest instant in a list.
