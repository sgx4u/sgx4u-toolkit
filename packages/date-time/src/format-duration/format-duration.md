# `formatDuration`

See the TSDoc on `formatDuration` for the contract.

## Import

```ts
import { formatDuration } from "@sgx4u/date-time";
```

## Examples

The TSDoc `@example` is covered by the tests.

## Edge cases

A value of the wrong type throws `TypeError`. An invalid duration throws `RangeError`. Parsers return `undefined` when the text does not match.

## Related

- [`addDuration`](../add-duration/add-duration.md)
