# `isWithinLast`

See the TSDoc on `isWithinLast` for the contract.

## Import

```ts
import { isWithinLast } from "@sgx4u/date-time";
```

## Examples

The TSDoc `@example` is the call covered by the tests.

## Edge cases

A value of the wrong type throws `TypeError`. An invalid date or option throws `RangeError`. Inputs are not mutated. A function that takes `timeZone` reads wall-clock fields in that zone, including across a daylight-saving change.

## Related

- [`toDate`](../to-date/to-date.md)
