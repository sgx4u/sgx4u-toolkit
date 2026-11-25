# `findClosestDateIndex`

Returns the index of the candidate nearest to a target.

## Import

```ts
import { findClosestDateIndex } from "@sgx4u/date-time";
```

## Signature

See the TSDoc on `findClosestDateIndex` for the parameters, defaults, and thrown errors.

## Examples

The examples in the TSDoc are the calls covered by `find-closest-date-index.test.ts`.

## Edge cases

Invalid dates throw `RangeError`. A value of the wrong type throws `TypeError`. Inputs are not mutated. Functions that take `timeZone` resolve daylight-saving gaps with the same rules as `createDate`.

## Related

- [`toDate`](../to-date/to-date.md)
- [`getDateParts`](../get-date-parts/get-date-parts.md)
