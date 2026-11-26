# `startOfUnit`

Returns the first millisecond of the unit that contains a date.

## Import

```ts
import { startOfUnit } from "@sgx4u/date-time";
```

## Signature

```ts
function startOfUnit(
    date: DateInput,
    unit: TimeUnit | "decade",
    options?: TimeZoneOptions & WeekOptions,
): Date;
```

## Options

| Name           | Type                              | Default     | Meaning                                        |
| -------------- | --------------------------------- | ----------- | ---------------------------------------------- |
| `timeZone`     | `string`                          | System zone | Zone the unit boundary is measured in.         |
| `weekStartsOn` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7` | `1`         | ISO weekday that starts a week. `1` is Monday. |

## Examples

```ts
startOfUnit("2026-11-26T15:45:00Z", "day", { timeZone: "UTC" }).toISOString();
// "2026-11-26T00:00:00.000Z"

startOfUnit("2026-11-26T00:00:00Z", "decade", {
    timeZone: "UTC",
}).toISOString();
// "2020-01-01T00:00:00.000Z"

startOfUnit("2024-09-08T12:00:00Z", "day", {
    timeZone: "America/Santiago",
}).toISOString();
// "2024-09-08T04:00:00.000Z"
```

## Edge cases

`unit` is a time unit or `"decade"`. An invalid date, unit, or zone throws `RangeError`. A value of the wrong type throws `TypeError`. `weekStartsOn` applies to `"week"`.

A boundary that daylight saving skips moves forward to the first instant that exists. Midnight on 2024-09-08 does not exist in `America/Santiago`, so the start of that day is `2024-09-08T04:00:00.000Z`.

## Related

- [`endOfUnit`](../end-of-unit/end-of-unit.md) returns the last millisecond of the same unit.
- [`isSameUnit`](../is-same-unit/is-same-unit.md) reports whether two dates fall in the same unit.
- [`roundToUnit`](../round-to-unit/round-to-unit.md) rounds a date to a unit increment.
