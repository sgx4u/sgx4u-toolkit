# `isLeapYear`

Reports whether a year has a February 29.

## Import

```ts
import { isLeapYear } from "@sgx4u/date-time";
```

## Signature

```ts
function isLeapYear(year: number): boolean;
```

## Options

This function has no options.

## Examples

```ts
import { isLeapYear } from "@sgx4u/date-time";

isLeapYear(2024);
// true

isLeapYear(1900);
// false

isLeapYear(2000);
// true

isLeapYear(2023);
// false
```

## Edge cases

The rule is the proleptic Gregorian rule. A century year is a leap year only when it is also divisible by 400, so 1900 is not and 2000 is. A value that is not a finite integer returns `false`.

## Related

- [`getDaysInYear`](../get-days-in-year/get-days-in-year.md)
- [`getDaysInMonth`](../get-days-in-month/get-days-in-month.md)
- [`getAge`](../get-age/get-age.md)
