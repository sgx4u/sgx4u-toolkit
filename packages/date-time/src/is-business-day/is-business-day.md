# `isBusinessDay`

See the TSDoc on `isBusinessDay` for the contract.

## Import

```ts
import { isBusinessDay } from "@sgx4u/date-time";
```

## Examples

A Saturday is not a business day with the default weekend. Adding one business day to a Friday lands on Monday and keeps the time of day.

## Edge cases

Amount `0` returns the same instant. A start on a weekend does not count as a step. The search stops with `RangeError` after 3660 consecutive non-business days.

## Related

- [`addDuration`](../add-duration/add-duration.md)
