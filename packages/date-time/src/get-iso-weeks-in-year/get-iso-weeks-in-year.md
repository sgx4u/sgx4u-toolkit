# `getISOWeeksInYear`

Returns the number of ISO weeks in a year.

## Import

```ts
import { getISOWeeksInYear } from "@sgx4u/date-time";
```

## Signature

```ts
function getISOWeeksInYear(year: number): 52 | 53 | undefined;
```

## Options

This function has no options.

## Examples

```ts
import { getISOWeeksInYear } from "@sgx4u/date-time";

getISOWeeksInYear(2020);
// 53

getISOWeeksInYear(2021);
// 52

getISOWeeksInYear(2026);
// 53
```

## Edge cases

A non-integer year returns `undefined`.


## Related

- [`getISOWeek`](../get-iso-week/get-iso-week.md)
- [`getISOWeekYear`](../get-iso-week-year/get-iso-week-year.md)
- [`getDaysInYear`](../get-days-in-year/get-days-in-year.md)
