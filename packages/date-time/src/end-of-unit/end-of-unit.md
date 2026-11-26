# `endOfUnit`

Returns the last millisecond of the unit that contains a date.

## Import

```ts
import { endOfUnit } from "@sgx4u/date-time";
```

## Signature

```ts
function endOfUnit(params: EndOfUnitParams): Date | undefined;
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
endOfUnit({
    date: "2026-11-26T15:45:00Z",
    unit: "day",
    timeZone: "UTC",
}).toISOString();
// "2026-11-26T23:59:59.999Z"

endOfUnit({
    date: "2026-11-26T15:45:00Z",
    unit: "year",
    timeZone: "UTC",
}).toISOString();
// "2026-12-31T23:59:59.999Z"
```

## Edge cases

The result is one millisecond before the next unit starts. `unit` may be a time unit or `"decade"`. An unknown unit throws `RangeError`. A date that is not usable returns `undefined`. The end is wall time in the zone, so the length of the unit in elapsed milliseconds changes across a daylight-saving transition. February's end is the 28th, or the 29th in a leap year.

## Related

- [`startOfUnit`](../start-of-unit/start-of-unit.md) returns the first millisecond of the same unit.
- [`differenceInCalendarUnit`](../difference-in-calendar-unit/difference-in-calendar-unit.md) counts boundaries between two instants.
