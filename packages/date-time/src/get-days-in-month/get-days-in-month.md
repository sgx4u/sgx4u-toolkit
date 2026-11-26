# `getDaysInMonth`

Returns the number of days in a Gregorian month.

## Import

```ts
import { getDaysInMonth } from "@sgx4u/date-time";
```

## Signature

```ts
function getDaysInMonth(year: number, month: number): number;
```

## Options

This function has no options.

## Examples

```ts
import { getDaysInMonth } from "@sgx4u/date-time";

getDaysInMonth(2024, 2);
// 29

getDaysInMonth(2023, 2);
// 28

getDaysInMonth(2024, 4);
// 30

getDaysInMonth(2024, 1);
// 31
```

## Edge cases

`month` is `1` for January through `12` for December. February has 29 days in a leap year and 28 otherwise. A non-integer year, or a month outside 1 through 12, throws a `RangeError`.

## Related

- [`getDaysInYear`](../get-days-in-year/get-days-in-year.md)
- [`isLeapYear`](../is-leap-year/is-leap-year.md)
- [`getDateParts`](../get-date-parts/get-date-parts.md)
