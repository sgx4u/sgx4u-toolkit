# `getDaysInYear`

Returns `366` when the Gregorian year is a leap year and `365` otherwise.

## Import

```ts
import { getDaysInYear } from "@sgx4u/date-time";
```

## Signature

```ts
function getDaysInYear(year: number): 365 | 366;
```

## Examples

```ts
getDaysInYear(2024); // 366
getDaysInYear(1900); // 365
```

## Edge cases

Year `0` returns `366`. A non-integer throws `RangeError`.

## Related

- [`isLeapYear`](../is-leap-year/is-leap-year.md) is the rule this count uses.
