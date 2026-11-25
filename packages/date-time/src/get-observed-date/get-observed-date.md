# `getObservedDate`

See the TSDoc on `getObservedDate` for the contract.

## Import

```ts
import { getObservedDate } from "@sgx4u/date-time";
```

## Examples

4 July 2020 was a Saturday. `nearest-weekday` observes it on 3 July, and `next-monday` observes it on 6 July. Good Friday 2026 is 3 April, two days before Easter Sunday.

## Edge cases

A `year-table` rule returns nothing for a year that is not in the table. When an observed day collides with another holiday, it moves forward again.

## Related

- [`getEasterSunday`](../get-easter-sunday/get-easter-sunday.md)
