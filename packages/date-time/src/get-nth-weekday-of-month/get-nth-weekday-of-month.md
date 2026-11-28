# `getNthWeekdayOfMonth`

Returns the start of the nth weekday in a month.

## Import

```ts
import { getNthWeekdayOfMonth } from "@sgx4u/date-time";
```

## Signature

```ts
function getNthWeekdayOfMonth(
    params: GetNthWeekdayOfMonthParams,
): Date | undefined;
```

## Parameters

| Name         | Type      | Required | Default | Meaning                                             |
| ------------ | --------- | -------- | ------- | --------------------------------------------------- |
| `year`       | `number`  | yes      |         | The Gregorian year.                                 |
| `month`      | `number`  | yes      |         | The month, from 1 through 12.                       |
| `weekday`    | `Weekday` | yes      |         | ISO weekday, Monday `1` through Sunday `7`.         |
| `occurrence` | `number`  | yes      |         | An integer from 1 through 5, or from -5 through -1. |
| `timeZone`   | `string`  | no       |         | Zone used for the result instant.                   |

## Examples

```ts
import { getNthWeekdayOfMonth } from "@sgx4u/date-time";

getNthWeekdayOfMonth({
    year: 2026,
    month: 11,
    weekday: 4,
    occurrence: 4,
    timeZone: "UTC",
})?.toISOString();
// "2026-11-26T00:00:00.000Z"

getNthWeekdayOfMonth({
    year: 2026,
    month: 2,
    weekday: 1,
    occurrence: -1,
    timeZone: "UTC",
})?.toISOString();
// "2026-02-23T00:00:00.000Z"

getNthWeekdayOfMonth({
    year: 2026,
    month: 2,
    weekday: 1,
    occurrence: 5,
    timeZone: "UTC",
});
// undefined
```

## Edge cases

`occurrence` `1` is the first and `-1` is the last. `5` is the fifth, which does not exist in every month and then returns `undefined`. `occurrence` must be an integer from 1 through 5 or from -5 through -1. `month` must be 1 through 12.

## Related

- [`getNextWeekday`](../get-next-weekday/get-next-weekday.md)
- [`getPreviousWeekday`](../get-previous-weekday/get-previous-weekday.md)
- [`getWeekOfMonth`](../get-week-of-month/get-week-of-month.md)
