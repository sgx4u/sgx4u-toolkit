# `findClosestDate`

Returns the candidate nearest to a target.

## Import

```ts
import { findClosestDate } from "@sgx4u/date-time";
```

## Signature

```ts
function findClosestDate(
    target: DateInput,
    candidates: readonly DateInput[],
): Date | undefined;
```

## Options

This function has no options.

## Examples

```ts
findClosestDate("2024-01-01T12:00:00Z", [
    "2024-01-01T00:00:00Z",
    "2024-01-02T00:00:00Z",
])?.toISOString();
// "2024-01-01T00:00:00.000Z"

findClosestDate("2024-01-01T00:00:00Z", []);
// undefined
```

## Edge cases

On a tie the earlier candidate wins. When two candidates are the same instant, the first one in the list wins. An empty list returns `undefined`. The array is not reordered. A value that is not a real date throws `RangeError`. `candidates` must be an array.

## Related

- [`findClosestDateIndex`](../find-closest-date-index/find-closest-date-index.md) returns the index of that candidate.
- [`getEarliestDate`](../get-earliest-date/get-earliest-date.md) returns the earliest instant in a list.
- [`compareDates`](../compare-dates/compare-dates.md) orders two instants.
