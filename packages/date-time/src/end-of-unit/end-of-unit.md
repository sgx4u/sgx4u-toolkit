# `endOfUnit`

Returns the last millisecond of the unit that contains a date.

## Import

```ts
import { endOfUnit } from "@sgx4u/date-time";
```

## Signature

```ts
function endOfUnit(
    date: DateInput,
    unit: TimeUnit | "decade",
    options?: TimeZoneOptions & WeekOptions,
): Date;
```

## Options

| Name           | Type      | Default     | Meaning                                        |
| -------------- | --------- | ----------- | ---------------------------------------------- |
| `timeZone`     | `string`  | System zone | Zone used to find the unit boundaries.         |
| `weekStartsOn` | `Weekday` | `1`         | ISO weekday that starts a week. `1` is Monday. |

## Examples

```ts
endOfUnit("2026-11-26T15:45:00Z", "day", { timeZone: "UTC" }).toISOString();
// "2026-11-26T23:59:59.999Z"

endOfUnit("2026-11-26T15:45:00Z", "year", { timeZone: "UTC" }).toISOString();
// "2026-12-31T23:59:59.999Z"
```

## Edge cases

The result is one millisecond before the next unit starts. `unit` may be a time unit or `"decade"`. An unknown unit throws `RangeError`. A date that does not parse throws `RangeError`. The end is wall time in the zone, so the length of the unit in elapsed milliseconds changes across a daylight-saving transition. February's end is the 28th, or the 29th in a leap year.

## Related

- [`startOfUnit`](../start-of-unit/start-of-unit.md) returns the first millisecond of the same unit.
- [`differenceInCalendarUnit`](../difference-in-calendar-unit/difference-in-calendar-unit.md) counts boundaries between two instants.
