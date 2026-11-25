# `isSameInstant`

Reports whether two values are the same millisecond.

## Import

```ts
import { isSameInstant } from "@sgx4u/date-time";
```

## Signature

See the TSDoc on `isSameInstant` for the parameters, defaults, and thrown errors.

## Examples

The examples in the TSDoc are the calls covered by `is-same-instant.test.ts`.

## Edge cases

Invalid dates throw `RangeError`. A value of the wrong type throws `TypeError`. Inputs are not mutated. Functions that take `timeZone` resolve daylight-saving gaps with the same rules as `createDate`.

## Related

- [`toDate`](../to-date/to-date.md)
- [`getDateParts`](../get-date-parts/get-date-parts.md)
