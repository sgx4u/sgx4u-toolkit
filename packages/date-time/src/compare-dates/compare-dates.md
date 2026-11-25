# `compareDates`

Compares two dates for Array#sort.

## Import

```ts
import { compareDates } from "@sgx4u/date-time";
```

## Signature

See the TSDoc on `compareDates` for the parameters, defaults, and thrown errors.

## Examples

The examples in the TSDoc are the calls covered by `compare-dates.test.ts`.

## Edge cases

Invalid dates throw `RangeError`. A value of the wrong type throws `TypeError`. Inputs are not mutated. Functions that take `timeZone` resolve daylight-saving gaps with the same rules as `createDate`.

## Related

- [`toDate`](../to-date/to-date.md)
- [`getDateParts`](../get-date-parts/get-date-parts.md)
