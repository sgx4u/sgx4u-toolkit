# `sortDates`

Returns a new array of dates in time order.

## Import

```ts
import { sortDates } from "@sgx4u/date-time";
```

## Signature

```ts
function sortDates(params: SortDatesParams): Date[] | undefined;
```

## Parameters

| Name    | Type                          | Required | Default       | Meaning                        |
| ------- | ----------------------------- | -------- | ------------- | ------------------------------ |
| `dates` | `readonly DateInput[]`        | yes      |               | The dates to sort.             |
| `order` | `"ascending" \| "descending"` | no       | `"ascending"` | Oldest first, or newest first. |

## Examples

```ts
sortDates({ dates: ["2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z"] }).map(
    (date) => date.toISOString(),
);
// ["2024-01-01T00:00:00.000Z", "2024-01-02T00:00:00.000Z"]

sortDates({
    dates: ["2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z"],
    order: "descending",
})[0]?.toISOString();
// "2024-01-02T00:00:00.000Z"

sortDates({ dates: [] }).length;
// 0
```

## Edge cases

The input array stays in its original order. Each result is a new `Date`. Equal instants keep their original relative order. A value that is not an array throws `TypeError`. An entry that is not a real date throws `RangeError`. An unknown `order` throws `RangeError`. Ordering compares absolute instants.

## Related

- [`compareDates`](../compare-dates/compare-dates.md) compares two dates for `Array#sort`.
- [`getEarliestDate`](../get-earliest-date/get-earliest-date.md) returns the earliest date in a list.
- [`removeDuplicateDates`](../remove-duplicate-dates/remove-duplicate-dates.md) keeps the first date of each unit.
