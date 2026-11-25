# `isValidInterval`

See the TSDoc on `isValidInterval` for the contract.

## Import

```ts
import { isValidInterval } from "@sgx4u/date-time";
```

## Examples

The TSDoc `@example` is covered by the tests. Intervals are half-open: the start is included and the end is excluded.

## Edge cases

An end before the start throws `RangeError`. Touching intervals do not overlap unless `countTouchingAsOverlap` is true. `mergeIntervals` joins touching intervals by default. Inputs are not mutated.

## Related

- [`createInterval`](../create-interval/create-interval.md)
