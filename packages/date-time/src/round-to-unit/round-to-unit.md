# `roundToUnit`

Rounds a date to a unit increment.

## Import

```ts
import { roundToUnit } from "@sgx4u/date-time";
```

## Signature

```ts
function roundToUnit(params: RoundToUnitParams): Date | undefined;
```

## Parameters

| Name        | Type                          | Required | Default                                  | Meaning                                                                     |
| ----------- | ----------------------------- | -------- | ---------------------------------------- | --------------------------------------------------------------------------- |
| `date`      | `DateInput`                   | yes      |                                          | The instant to round.                                                       |
| `unit`      | `TimeUnit \| "decade"`        | yes      |                                          | The unit to round to.                                                       |
| `increment` | `number`                      | no       | `1`                                      | How many units form one step. For minutes, `15` rounds to the quarter hour. |
| `mode`      | `"nearest" \| "down" \| "up"` | no       | `"nearest"`                              | Which boundary to choose. `"nearest"` at the halfway point moves later.     |
| `timeZone`  | `string`                      | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset                          |

## Examples

```ts
roundToUnit({
    date: "2024-06-15T10:07:30Z",
    unit: "minute",
    timeZone: "UTC",
    increment: 15,
}).toISOString();
// "2024-06-15T10:15:00.000Z"

roundToUnit({
    date: "2024-06-15T10:07:00Z",
    unit: "minute",
    timeZone: "UTC",
    increment: 15,
    mode: "down",
}).toISOString();
// "2024-06-15T10:00:00.000Z"

roundToUnit({
    date: "2024-06-15T10:07:00Z",
    unit: "minute",
    timeZone: "UTC",
    increment: 15,
    mode: "up",
}).toISOString();
// "2024-06-15T10:15:00.000Z"
```

## Edge cases

For minutes the increment must be one of 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, or 30. An increment that does not divide the next clock unit throws `RangeError`, so `7` minutes throws. `"nearest"` at the exact halfway point moves away from the earlier boundary. An unknown `mode` throws `RangeError`. An invalid date throws `RangeError`.

Units are measured on the wall clock in `timeZone`. A daylight-saving gap that removes the rounded boundary moves forward to the first instant that exists. `2024-03-10T06:40:00Z` is 1:40 in `America/New_York`. Rounding that instant to the hour returns `2024-03-10T07:00:00.000Z`, because 2:00 does not exist.

## Related

- [`startOfUnit`](../start-of-unit/start-of-unit.md) returns the first millisecond of a unit.
- [`roundDuration`](../round-duration/round-duration.md) rounds a duration to a unit.
- [`endOfUnit`](../end-of-unit/end-of-unit.md) returns the last millisecond of a unit.
