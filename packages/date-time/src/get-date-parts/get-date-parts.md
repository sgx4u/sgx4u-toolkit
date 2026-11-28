# `getDateParts`

Returns the wall-clock fields of an instant in a time zone.

## Import

```ts
import { getDateParts } from "@sgx4u/date-time";
```

## Signature

```ts
function getDateParts(params: GetDatePartsParams): DateParts | undefined;
```

## Parameters

| Name       | Type        | Required | Default                                  | Meaning                                            |
| ---------- | ----------- | -------- | ---------------------------------------- | -------------------------------------------------- |
| `date`     | `DateInput` | yes      |                                          | The instant to read.                               |
| `timeZone` | `string`    | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset |

## Examples

```ts
import { getDateParts } from "@sgx4u/date-time";

getDateParts({ date: "2024-06-15T16:00:00.000Z", timeZone: "America/New_York" })
    .hour;
// 12

getDateParts({ date: "2024-06-15T16:00:00.000Z", timeZone: "Asia/Kolkata" })
    .minute;
// 30

getDateParts({ date: "2024-06-15", timeZone: "UTC" }).hour;
// 0

getDateParts({ date: "2024-06-15T16:00:00.000Z", timeZone: "Asia/Kolkata" })
    .offsetMinutes;
// 330
```

## Edge cases

Invalid `date` returns `undefined`. An invalid `timeZone` throws.

## Related

- [`getTimeOfDay`](../get-time-of-day/get-time-of-day.md)
- [`getUTCOffset`](../get-utc-offset/get-utc-offset.md)
- [`getWallTimeStatus`](../get-wall-time-status/get-wall-time-status.md)
