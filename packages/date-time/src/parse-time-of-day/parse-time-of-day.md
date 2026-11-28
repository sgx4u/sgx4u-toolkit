# `parseTimeOfDay`

Parses a clock time into hour, minute, second, and millisecond.

## Import

```ts
import { parseTimeOfDay } from "@sgx4u/date-time";
```

## Signature

```ts
function parseTimeOfDay(value: string): TimeOfDay | undefined;
```

## Parameters

| Name    | Type     | Required | Default | Meaning             |
| ------- | -------- | -------- | ------- | ------------------- |
| `value` | `string` | yes      |         | The candidate text. |

## Examples

```ts
parseTimeOfDay("09:30");
// { hour: 9, minute: 30, second: 0, millisecond: 0 }

parseTimeOfDay("21:30:15.250");
// { hour: 21, minute: 30, second: 15, millisecond: 250 }

parseTimeOfDay("9:30 pm");
// { hour: 21, minute: 30, second: 0, millisecond: 0 }

parseTimeOfDay("12:00 a.m.");
// { hour: 0, minute: 0, second: 0, millisecond: 0 }
```

## Edge cases

Text that does not match returns `undefined`. Accepted forms are `H:mm`, `HH:mm`, `HH:mm:ss`, `HH:mm:ss.SSS`, and a 12-hour time with `am` or `pm`. The marker may use any case, an optional space, and optional dots. `12:00 am` is hour `0` and `12:00 pm` is hour `12`. `24:00`, a minute or second above `59`, and an hour outside `0`–`23` (or `1`–`12` with a marker) return `undefined`. A value that is not a string throws `TypeError`. The result is a time of day with no date and no time zone.

## Related

- [`formatTimeOfDay`](../format-time-of-day/format-time-of-day.md) writes a time of day in a locale.
- [`getTimeOfDay`](../get-time-of-day/get-time-of-day.md) reads the wall-clock time of a date.
- [`isTimeOfDayInRange`](../is-time-of-day-in-range/is-time-of-day-in-range.md) tests a daily window.
