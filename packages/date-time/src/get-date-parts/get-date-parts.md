# `getDateParts`

Returns the wall-clock fields of an instant in a time zone.

## Import

```ts
import { getDateParts } from "@sgx4u/date-time";
```

## Signature

```ts
function getDateParts(date: DateInput, options?: TimeZoneOptions): DateParts;
```

## Options

| Name       | Type     | Default                                 | Meaning                                                              |
| ---------- | -------- | --------------------------------------- | -------------------------------------------------------------------- |
| `timeZone` | `string` | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`. |

## Examples

```ts
import { getDateParts } from "@sgx4u/date-time";

getDateParts("2024-06-15T16:00:00.000Z", {
    timeZone: "America/New_York",
}).hour;
// 12

getDateParts("2024-06-15T16:00:00.000Z", {
    timeZone: "Asia/Kolkata",
}).minute;
// 30

getDateParts("2024-06-15", { timeZone: "UTC" }).hour;
// 0

getDateParts("2024-06-15T16:00:00.000Z", {
    timeZone: "Asia/Kolkata",
}).offsetMinutes;
// 330
```

## Edge cases

Months are `1` through `12`. `weekday` is the ISO number, Monday `1` through Sunday `7`. A date-only string is midnight in the zone. `offsetMinutes` can be fractional when a historical offset is not a whole minute. An unusable zone throws a `RangeError`.

## Related

- [`getTimeOfDay`](../get-time-of-day/get-time-of-day.md)
- [`getUtcOffset`](../get-utc-offset/get-utc-offset.md)
- [`getWallTimeStatus`](../get-wall-time-status/get-wall-time-status.md)
