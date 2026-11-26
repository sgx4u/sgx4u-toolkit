# `getIsoWeeksInYear`

Returns the number of ISO weeks in a year.

## Import

```ts
import { getIsoWeeksInYear } from "@sgx4u/date-time";
```

## Signature

```ts
function getIsoWeeksInYear(year: number): 52 | 53;
```

## Options

This function has no options.

## Examples

```ts
import { getIsoWeeksInYear } from "@sgx4u/date-time";

getIsoWeeksInYear(2020);
// 53

getIsoWeeksInYear(2021);
// 52

getIsoWeeksInYear(2026);
// 53
```

## Edge cases

The result is `53` when the year has an ISO week 53, and `52` otherwise. A non-integer year throws a `RangeError`.

## Related

- [`getIsoWeek`](../get-iso-week/get-iso-week.md)
- [`getIsoWeekYear`](../get-iso-week-year/get-iso-week-year.md)
- [`getDaysInYear`](../get-days-in-year/get-days-in-year.md)
