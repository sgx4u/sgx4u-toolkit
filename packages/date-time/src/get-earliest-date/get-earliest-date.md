# `getEarliestDate`

Returns the earliest date in a list.

## Import

```ts
import { getEarliestDate } from "@sgx4u/date-time";
```

## Signature

```ts
function getEarliestDate(params: GetEarliestDateParams): Date | undefined;
```

## Parameters

| Name    | Type                   | Required | Default | Meaning              |
| ------- | ---------------------- | -------- | ------- | -------------------- |
| `dates` | `readonly DateInput[]` | yes      |         | The dates to search. |

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

An empty list returns `undefined`. A non-array throws. A bad entry throws.

## Related

- [`getLatestDate`](../get-latest-date/get-latest-date.md)
- [`isBefore`](../is-before/is-before.md)
- [`isSameInstant`](../is-same-instant/is-same-instant.md)
