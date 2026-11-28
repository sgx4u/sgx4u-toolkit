# `unitedStatesHolidays`

United States federal holidays for one year, shaped for `holidays`.

## Import

```ts
import { unitedStatesHolidays } from "@sgx4u/date-time/holidays/united-states";
```

## Signature

```ts
function unitedStatesHolidays(year: number): ConfiguredHoliday[] | undefined;
```

## Parameters

| Name   | Type     | Required | Default | Meaning             |
| ------ | -------- | -------- | ------- | ------------------- |
| `year` | `number` | yes      |         | The Gregorian year. |

## Examples

```ts
import { unitedStatesHolidays } from "@sgx4u/date-time/holidays/united-states";

unitedStatesHolidays(2026);
```

## Edge cases

`date` is the observed day as `YYYY-MM-DD`. A Saturday holiday is the Friday before, and a Sunday holiday is the Monday after. A year that is not an integer returns `undefined`.

## Related

- [`isHoliday`](../../is-holiday/is-holiday.md)
- [`indiaHolidays`](../india-holidays/india-holidays.md)
