# `findClosestDate`

Returns the candidate nearest to a target.

## Import

```ts
import { findClosestDate } from "@sgx4u/date-time";
```

## Signature

```ts
function findClosestDate(params: FindClosestDateParams): Date | undefined;
```

## Parameters

| Name         | Type                   | Required | Default | Meaning                                          |
| ------------ | ---------------------- | -------- | ------- | ------------------------------------------------ |
| `target`     | `DateInput`            | yes      |         | The instant to approach.                         |
| `candidates` | `readonly DateInput[]` | yes      |         | The dates to search. The array is not reordered. |

## Examples

```ts
findClosestDate({
    target: "2024-01-01T12:00:00Z",
    candidates: ["2024-01-01T00:00:00Z", "2024-01-02T00:00:00Z"],
})?.toISOString();
// "2024-01-01T00:00:00.000Z"

findClosestDate({ target: "2024-01-01T00:00:00Z", candidates: [] });
// undefined
```

## Edge cases

On a tie the earlier candidate wins. When two candidates are the same instant, the first one in the list wins. An empty list returns `undefined`. The array is not reordered. A value that is not a real date returns `undefined`. `candidates` must be an array.

## Related

- [`findClosestDateIndex`](../find-closest-date-index/find-closest-date-index.md) returns the index of that candidate.
- [`getEarliestDate`](../get-earliest-date/get-earliest-date.md) returns the earliest instant in a list.
- [`compareDates`](../compare-dates/compare-dates.md) orders two instants.
