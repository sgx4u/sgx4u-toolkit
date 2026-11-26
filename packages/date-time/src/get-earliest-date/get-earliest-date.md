# `getEarliestDate`

Returns the earliest date in a list.

## Import

```ts
import { getEarliestDate } from "@sgx4u/date-time";
```

## Signature

```ts
function getEarliestDate(dates: readonly DateInput[]): Date | undefined;
```

## Options

This function has no options.

## Examples

```ts
import { getEarliestDate } from "@sgx4u/date-time";

getEarliestDate([
    "2024-01-02T00:00:00Z",
    "2024-01-01T00:00:00Z",
])?.toISOString();
// "2024-01-01T00:00:00.000Z"

getEarliestDate([
    "2024-06-01T00:00:00Z",
    1_700_000_000_000,
    "2024-01-01T00:00:00Z",
])?.toISOString();
// "2023-11-14T22:13:20.000Z"

getEarliestDate([]);
// undefined
```

## Edge cases

The input array is not reordered. A number is Unix time in milliseconds, so `1_700_000_000_000` is earlier than either 2024 string in the second example. An empty list returns `undefined`. A non-array, or an entry that is not a real date, throws. The returned `Date` is a new object.

## Related

- [`getLatestDate`](../get-latest-date/get-latest-date.md)
- [`isBefore`](../is-before/is-before.md)
- [`isSameInstant`](../is-same-instant/is-same-instant.md)
