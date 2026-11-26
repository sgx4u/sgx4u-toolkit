# `getLatestDate`

Returns the latest date in a list.

## Import

```ts
import { getLatestDate } from "@sgx4u/date-time";
```

## Signature

```ts
function getLatestDate(dates: readonly DateInput[]): Date | undefined;
```

## Options

This function has no options.

## Examples

```ts
import { getLatestDate } from "@sgx4u/date-time";

getLatestDate(["2024-01-01T00:00:00Z", "2024-01-02T00:00:00Z"])?.toISOString();
// "2024-01-02T00:00:00.000Z"

getLatestDate(["2024-01-02T00:00:00Z", "2024-01-01T00:00:00Z"])?.toISOString();
// "2024-01-02T00:00:00.000Z"

getLatestDate([]);
// undefined
```

## Edge cases

The input array is not reordered. An empty list returns `undefined`. A non-array, or an entry that is not a real date, throws. The returned `Date` is a new object.

## Related

- [`getEarliestDate`](../get-earliest-date/get-earliest-date.md)
- [`isAfter`](../is-after/is-after.md)
- [`isSameInstant`](../is-same-instant/is-same-instant.md)
