# `isLeapYear`

Reports whether a proleptic Gregorian year has a February 29.

## Import

```ts
import { isLeapYear } from "@sgx4u/date-time";
```

## Signature

```ts
function isLeapYear(year: number): boolean;
```

## Examples

```ts
isLeapYear(2024); // true
isLeapYear(1900); // false
isLeapYear(2000); // true
isLeapYear(0); // true
```

## Edge cases

A century year is a leap year only when it is also divisible by 400. A non-integer throws `RangeError`. A non-number throws `TypeError`.

## Related

- [`getDaysInMonth`](../get-days-in-month/get-days-in-month.md) uses the same rule for February.
- [`getDaysInYear`](../get-days-in-year/get-days-in-year.md) returns 366 in a leap year.
