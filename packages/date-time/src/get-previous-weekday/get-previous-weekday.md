# `getPreviousWeekday`

Returns the start of the previous given weekday.

## Import

```ts
import { getPreviousWeekday } from "@sgx4u/date-time";
```

## Signature

See the TSDoc on `getPreviousWeekday` for the parameters, defaults, and thrown errors.

## Examples

The examples in the TSDoc are the calls covered by `get-previous-weekday.test.ts`.

## Edge cases

Invalid dates throw `RangeError`. A value of the wrong type throws `TypeError`. Inputs are not mutated. Functions that take `timeZone` resolve daylight-saving gaps with the same rules as `createDate`.

## Related

- [`toDate`](../to-date/to-date.md)
- [`getDateParts`](../get-date-parts/get-date-parts.md)
