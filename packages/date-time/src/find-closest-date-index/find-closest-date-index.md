# `findClosestDateIndex`

Returns the index of the candidate nearest to a target.

## Import

```ts
import { findClosestDateIndex } from "@sgx4u/date-time";
```

## Signature

```ts
function findClosestDateIndex(
    target: DateInput,
    candidates: readonly DateInput[],
): number;
```

## Options

This function has no options.

## Examples

```ts
findClosestDateIndex("2024-01-01T12:00:00Z", [
    "2024-01-02T00:00:00Z",
    "2024-01-01T00:00:00Z",
]);
// 1

findClosestDateIndex("2024-01-01T00:00:00Z", []);
// -1
```

## Edge cases

On a tie the earlier candidate wins. Equal candidates keep the first index. An empty list returns `-1`. A value that is not a real date throws `RangeError`. `candidates` must be an array.

## Related

- [`findClosestDate`](../find-closest-date/find-closest-date.md) returns the date at that index.
- [`getEarliestDate`](../get-earliest-date/get-earliest-date.md) returns the earliest instant in a list.
