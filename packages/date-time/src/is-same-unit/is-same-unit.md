# `isSameUnit`

Reports whether two dates fall in the same unit in a time zone.

## Import

```ts
import { isSameUnit } from "@sgx4u/date-time";
```

## Signature

See the TSDoc on `isSameUnit` for the parameters, defaults, and thrown errors.

## Examples

The examples in the TSDoc are the calls covered by `is-same-unit.test.ts`.

## Edge cases

Invalid dates throw `RangeError`. A value of the wrong type throws `TypeError`. Inputs are not mutated. Functions that take `timeZone` resolve daylight-saving gaps with the same rules as `createDate`.

## Related

- [`toDate`](../to-date/to-date.md)
- [`getDateParts`](../get-date-parts/get-date-parts.md)
