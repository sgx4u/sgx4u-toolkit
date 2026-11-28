# `indiaHolidays`

National holidays of India for one year, shaped for `holidays`.

## Import

```ts
import { indiaHolidays } from "@sgx4u/date-time/holidays/india";
```

## Signature

```ts
function indiaHolidays(year: number): ConfiguredHoliday[] | undefined;
```

## Parameters

| Name   | Type     | Required | Default | Meaning             |
| ------ | -------- | -------- | ------- | ------------------- |
| `year` | `number` | yes      |         | The Gregorian year. |

## Examples

```ts
import { createDateTime } from "@sgx4u/date-time";
import { indiaHolidays } from "@sgx4u/date-time/holidays/india";

const holidays = indiaHolidays(2026);
createDateTime({ holidays, timeZone: "Asia/Kolkata" });
```

## Edge cases

`date` is the observed calendar day as `YYYY-MM-DD`. A year that is not an integer returns `undefined`. A lunar holiday missing from that year's table is omitted. Fixed holidays are present every year.

## Related

- [`isHoliday`](../../is-holiday/is-holiday.md)
- [`createDateTime`](../../create-date-time/create-date-time.md)
