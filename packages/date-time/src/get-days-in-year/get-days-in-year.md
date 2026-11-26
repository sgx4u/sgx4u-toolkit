# `getDaysInYear`

Returns the number of days in a Gregorian year.

## Import

```ts
import { getDaysInYear } from "@sgx4u/date-time";
```

## Signature

```ts
function getDaysInYear(year: number): 365 | 366 | undefined;
```

## Parameters

| Name   | Type     | Required | Default | Meaning             |
| ------ | -------- | -------- | ------- | ------------------- |
| `year` | `number` | yes      |         | The Gregorian year. |

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

A year that is not an integer returns `undefined`.

## Related

- [`isLeapYear`](../is-leap-year/is-leap-year.md)
- [`getDaysInMonth`](../get-days-in-month/get-days-in-month.md)
- [`getDayOfYear`](../get-day-of-year/get-day-of-year.md)
