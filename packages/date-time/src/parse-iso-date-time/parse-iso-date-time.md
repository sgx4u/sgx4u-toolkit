# `parseIsoDateTime`

See the TSDoc on `parseIsoDateTime` for the contract, defaults, and errors.

## Import

```ts
import { parseIsoDateTime } from "@sgx4u/date-time";
```

## Examples

The TSDoc `@example` is covered by the tests.

## Edge cases

A value of the wrong type throws `TypeError`. An invalid date or option throws `RangeError`. A parser returns `undefined` when the text does not match. Inputs are not mutated.

## Related

- [`toDate`](../to-date/to-date.md)
