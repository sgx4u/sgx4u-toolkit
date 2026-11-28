# `startOfUnit`

Returns the first millisecond of the unit that contains a date.

## Import

```ts
import { startOfUnit } from "@sgx4u/date-time";
```

## Signature

```ts
function startOfUnit(params: StartOfUnitParams): Date | undefined;
```

## Parameters

| Name           | Type                   | Required | Default                                  | Meaning                                                 |
| -------------- | ---------------------- | -------- | ---------------------------------------- | ------------------------------------------------------- |
| `date`         | `DateInput`            | yes      |                                          | The instant to align.                                   |
| `unit`         | `TimeUnit \| "decade"` | yes      |                                          | A time unit, or `"decade"`.                             |
| `timeZone`     | `string`               | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset      |
| `weekStartsOn` | `Weekday`              | no       | `1`                                      | ISO weekday number that starts the week. `1` is Monday. |

## Examples

```ts
startOfUnit({
    date: "2026-11-26T15:45:00Z",
    unit: "day",
    timeZone: "UTC",
}).toISOString();
// "2026-11-26T00:00:00.000Z"

startOfUnit({
    date: "2026-11-26T00:00:00Z",
    unit: "decade",
    timeZone: "UTC",
}).toISOString();
// "2020-01-01T00:00:00.000Z"

startOfUnit({
    date: "2024-09-08T12:00:00Z",
    unit: "day",
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
