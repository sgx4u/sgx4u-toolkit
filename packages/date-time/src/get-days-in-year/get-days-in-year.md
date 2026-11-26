# `getDaysInYear`

Returns the number of days in a Gregorian year.

## Import

```ts
import { getDaysInYear } from "@sgx4u/date-time";
```

## Signature

```ts
function getDaysInYear(year: number): 365 | 366;
```

## Options

This function has no options.

## Examples

```ts
import { getDaysInYear } from "@sgx4u/date-time";

getDaysInYear(2024);
// 366

getDaysInYear(1900);
// 365

getDaysInYear(2000);
// 366
```

## Edge cases

A leap year has 366 days and every other year has 365. Year 1900 is not a leap year. Year 2000 is. A non-integer year throws a `RangeError`.

## Related

- [`isLeapYear`](../is-leap-year/is-leap-year.md)
- [`getDaysInMonth`](../get-days-in-month/get-days-in-month.md)
- [`getDayOfYear`](../get-day-of-year/get-day-of-year.md)
