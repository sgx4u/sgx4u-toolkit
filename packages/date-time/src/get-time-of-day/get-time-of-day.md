# `getTimeOfDay`

Returns the wall-clock time of a date in a zone.

## Import

```ts
import { getTimeOfDay } from "@sgx4u/date-time";
```

## Signature

```ts
function getTimeOfDay(date: DateInput, options?: TimeZoneOptions): TimeOfDay;
```

## Options

| Name       | Type     | Default                                 | Meaning                                                              |
| ---------- | -------- | --------------------------------------- | -------------------------------------------------------------------- |
| `timeZone` | `string` | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`. |

## Examples

```ts
import { getTimeOfDay } from "@sgx4u/date-time";

getTimeOfDay("2026-11-25T22:00:00.000Z", { timeZone: "Asia/Kolkata" });
// { hour: 3, minute: 30, second: 0, millisecond: 0 }

getTimeOfDay("2026-11-25T22:00:00.000Z", { timeZone: "UTC" });
// { hour: 22, minute: 0, second: 0, millisecond: 0 }

getTimeOfDay("2026-11-25", { timeZone: "UTC" });
// { hour: 0, minute: 0, second: 0, millisecond: 0 }
```

## Edge cases

`hour` is 0 through 23. A date-only string is midnight in the zone. The date can fall on the next calendar day in a zone ahead of UTC; this function returns only the clock time. A value that is not a real date throws a `RangeError`.

## Related

- [`getDateParts`](../get-date-parts/get-date-parts.md)
- [`isTimeOfDayInRange`](../is-time-of-day-in-range/is-time-of-day-in-range.md)
- [`getUTCOffset`](../get-utc-offset/get-utc-offset.md)
