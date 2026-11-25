# `getNthWeekdayOfMonth`

Returns the nth weekday of a month, or undefined when it does not exist.

## Import

```ts
import { getNthWeekdayOfMonth } from "@sgx4u/date-time";
```

## Signature

See the TSDoc on `getNthWeekdayOfMonth` for the parameters, defaults, and thrown errors.

## Examples

The examples in the TSDoc are the calls covered by `get-nth-weekday-of-month.test.ts`.

## Edge cases

Invalid dates throw `RangeError`. A value of the wrong type throws `TypeError`. Inputs are not mutated. Functions that take `timeZone` resolve daylight-saving gaps with the same rules as `createDate`.

## Related

- [`toDate`](../to-date/to-date.md)
- [`getDateParts`](../get-date-parts/get-date-parts.md)
