# `toTemporalInstant`

See the TSDoc on `toTemporalInstant` for the contract.

## Import

```ts
import { toTemporalInstant } from "@sgx4u/date-time";
```

## Examples

Western Easter 2026 is 5 April. Orthodox Easter 2026 is 12 April. `fromTemporal` reads `epochMilliseconds`. `toTemporalInstant` throws when the runtime has no `Temporal` global.

## Edge cases

Easter years outside 1583 through 9999 throw `RangeError`.

## Related

- [`getDateParts`](../get-date-parts/get-date-parts.md)
