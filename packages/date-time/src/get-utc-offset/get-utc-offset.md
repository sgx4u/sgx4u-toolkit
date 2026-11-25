# `getUtcOffset`

Returns the offset from UTC in minutes for one instant in a time zone.

## Import

```ts
import { getUtcOffset } from "@sgx4u/date-time";
```

## Signature

```ts
function getUtcOffset(date: DateInput, timeZone: string): number;
```

## Examples

```ts
getUtcOffset("2024-06-15T12:00:00Z", "Asia/Kolkata"); // 330
getUtcOffset("2024-01-15T12:00:00Z", "America/New_York"); // -300
getUtcOffset("2024-07-15T12:00:00Z", "America/New_York"); // -240
```

## Edge cases

The result may be a fraction. `America/Detroit` at `1904-06-01T17:32:11Z` is `-332.1833…` minutes, which is −5 hours, 32 minutes, and 11 seconds. An unknown zone throws `RangeError`.

## Related

- [`getDateParts`](../get-date-parts/get-date-parts.md) includes the offset with the other fields.
