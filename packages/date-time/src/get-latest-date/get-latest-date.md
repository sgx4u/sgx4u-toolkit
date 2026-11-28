# `getLatestDate`

Returns the latest date in a list.

## Import

```ts
import { getLatestDate } from "@sgx4u/date-time";
```

## Signature

```ts
function getLatestDate(params: GetLatestDateParams): Date | undefined;
```

## Parameters

| Name    | Type                   | Required | Default | Meaning              |
| ------- | ---------------------- | -------- | ------- | -------------------- |
| `dates` | `readonly DateInput[]` | yes      |         | The dates to search. |

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

An empty list returns `undefined`. A non-array throws. A bad entry throws.

## Related

- [`getEarliestDate`](../get-earliest-date/get-earliest-date.md)
- [`isAfter`](../is-after/is-after.md)
- [`isSameInstant`](../is-same-instant/is-same-instant.md)
