# `getDaysInMonth`

Returns the number of days in a Gregorian month.

## Import

```ts
import { getDaysInMonth } from "@sgx4u/date-time";
```

## Signature

```ts
function getDaysInMonth(
    params: GetDaysInMonthParams,
): 28 | 29 | 30 | 31 | undefined;
```

## Parameters

| Name    | Type     | Required | Default | Meaning                       |
| ------- | -------- | -------- | ------- | ----------------------------- |
| `year`  | `number` | yes      |         | The Gregorian year.           |
| `month` | `number` | yes      |         | The month, from 1 through 12. |

## Examples

```ts
getDaysInMonth({ year: 2024, month: 2 });
// 29

getDaysInMonth({ year: 2023, month: 2 });
// 28
```

## Edge cases

A non-integer `year` or `month`, or a month outside 1 through 12, returns `undefined`.

## Related

- [`getDaysInYear`](../get-days-in-year/get-days-in-year.md)
- [`isLeapYear`](../is-leap-year/is-leap-year.md)
- [`getDateParts`](../get-date-parts/get-date-parts.md)
