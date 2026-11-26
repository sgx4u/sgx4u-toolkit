# `compareDates`

Compares two instants for `Array#sort`.

## Import

```ts
import { compareDates } from "@sgx4u/date-time";
```

## Signature

```ts
function compareDates(first: DateInput, second: DateInput): -1 | 0 | 1;
```

## Options

This function has no options.

## Examples

```ts
compareDates("2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z");
// 1

compareDates("2024-06-15T11:00:00Z", "2024-06-15T12:00:00.000Z");
// -1

compareDates("2024-06-15T12:00:00.000Z", "2024-06-15T12:00:00.000Z");
// 0
```

## Edge cases

The result is `-1` when `first` is earlier, `1` when it is later, and `0` when the instants match. A value that is not a real date throws `RangeError`. A value of the wrong type throws `TypeError`. Equal instants compare as `0` even when one is a `Date` and the other is an ISO string.

## Related

- [`isBefore`](../is-before/is-before.md) reports whether one instant is earlier.
- [`isAfter`](../is-after/is-after.md) reports whether one instant is later.
- [`sortDates`](../sort-dates/sort-dates.md) returns a new array in instant order.
- [`getEarliestDate`](../get-earliest-date/get-earliest-date.md) returns the earliest instant in a list.
