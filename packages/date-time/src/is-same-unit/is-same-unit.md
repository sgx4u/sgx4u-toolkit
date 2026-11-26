# `isSameUnit`

Reports whether two dates fall in the same unit in a time zone.

## Import

```ts
import { isSameUnit } from "@sgx4u/date-time";
```

## Signature

```ts
function isSameUnit(params: IsSameUnitParams): boolean;
```

## Parameters

| Name           | Type        | Required | Default | Meaning                            |
| -------------- | ----------- | -------- | ------- | ---------------------------------- |
| `first`        | `DateInput` | yes      |         | The first date.                    |
| `second`       | `DateInput` | yes      |         | The second date.                   |
| `unit`         | `TimeUnit`  | yes      |         | The unit to compare.               |
| `timeZone`     | `string`    | no       |         | Zone used to read unit boundaries. |
| `weekStartsOn` | `Weekday`   | no       |         | ISO weekday that starts the week.  |

## Examples

```ts
import { isSameUnit } from "@sgx4u/date-time";

isSameUnit({
    first: "2024-06-15T23:00:00Z",
    second: "2024-06-16T02:00:00Z",
    unit: "day",
    timeZone: "Asia/Kolkata",
});
// true

isSameUnit({
    first: "2024-06-15T23:00:00Z",
    second: "2024-06-16T02:00:00Z",
    unit: "day",
    timeZone: "UTC",
});
// false

isSameUnit({
    first: "2026-11-23T00:00:00Z",
    second: "2026-11-29T00:00:00Z",
    unit: "week",
    timeZone: "UTC",
});
// true
```

## Edge cases

The comparison uses the start of the unit, so a daylight-saving day still counts as one day. A week uses `weekStartsOn`, which defaults to Monday. An unknown unit or zone throws a `RangeError`.

## Related

- [`getWeekOfYear`](../get-week-of-year/get-week-of-year.md)
- [`isToday`](../is-today/is-today.md)
- [`getDateParts`](../get-date-parts/get-date-parts.md)
