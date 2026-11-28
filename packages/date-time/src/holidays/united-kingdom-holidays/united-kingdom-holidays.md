# `unitedKingdomHolidays`

England and Wales bank holidays for one year, shaped for `holidays`.

## Import

```ts
import { unitedKingdomHolidays } from "@sgx4u/date-time/holidays/united-kingdom";
```

## Signature

```ts
function unitedKingdomHolidays(year: number): ConfiguredHoliday[] | undefined;
```

## Parameters

| Name   | Type     | Required | Default | Meaning             |
| ------ | -------- | -------- | ------- | ------------------- |
| `year` | `number` | yes      |         | The Gregorian year. |

## Examples

```ts
import { unitedKingdomHolidays } from "@sgx4u/date-time/holidays/united-kingdom";

unitedKingdomHolidays(2026);
```

## Edge cases

`date` is the observed day as `YYYY-MM-DD`. A weekend holiday moves to the next free weekday. A year that is not an integer returns `undefined`.

## Related

- [`isHoliday`](../../is-holiday/is-holiday.md)
- [`unitedStatesHolidays`](../united-states-holidays/united-states-holidays.md)
