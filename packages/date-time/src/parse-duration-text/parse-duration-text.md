# `parseDurationText`

See the TSDoc on `parseDurationText` for the contract.

## Import

```ts
import { parseDurationText } from "@sgx4u/date-time";
```

## Examples

The TSDoc `@example` is covered by the tests.

## Edge cases

A value of the wrong type throws `TypeError`. An invalid duration throws `RangeError`. Parsers return `undefined` when the text does not match.

## Related

- [`addDuration`](../add-duration/add-duration.md)
