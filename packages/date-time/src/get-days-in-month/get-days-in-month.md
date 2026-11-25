# `getDaysInMonth`

Returns the number of days in a Gregorian month. `month` is `1` through `12`.

## Import

```ts
import { getDaysInMonth } from "@sgx4u/date-time";
```

## Signature

```ts
function getDaysInMonth(year: number, month: number): number;
```

## Examples

```ts
getDaysInMonth(2024, 2); // 29
getDaysInMonth(2023, 2); // 28
getDaysInMonth(2024, 4); // 30
```

## Edge cases

Month `0` or `13` throws `RangeError`. The year uses the proleptic Gregorian leap-year rule.

## Related

- [`isLeapYear`](../is-leap-year/is-leap-year.md) reports whether February has 29 days.
