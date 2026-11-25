# `millisecondsToDuration`

See the TSDoc on `millisecondsToDuration` for the contract.

## Import

```ts
import { millisecondsToDuration } from "@sgx4u/date-time";
```

## Examples

One hour and 30 minutes is 5400000 milliseconds. Months and years need `relativeTo` because their length depends on the calendar.

## Edge cases

A day is 24 hours when `relativeTo` is omitted. `millisecondsToDuration` omits zero fields.

## Related

- [`normalizeDuration`](../normalize-duration/normalize-duration.md)
