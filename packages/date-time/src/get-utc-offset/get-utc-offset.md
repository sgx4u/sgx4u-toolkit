# `getUTCOffset`

Returns the offset from UTC, in minutes, for an instant in a zone.

## Import

```ts
import { getUTCOffset } from "@sgx4u/date-time";
```

## Signature

```ts
function getUTCOffset(params: GetUTCOffsetParams): number | undefined;
```

## Parameters

| Name       | Type        | Required | Default | Meaning                         |
| ---------- | ----------- | -------- | ------- | ------------------------------- |
| `date`     | `DateInput` | yes      |         | The instant to measure.         |
| `timeZone` | `string`    | yes      |         | An IANA name or a fixed offset. |

## Examples

```ts
import { getUTCOffset } from "@sgx4u/date-time";

getUTCOffset({ date: "2024-06-15T12:00:00Z", timeZone: "Asia/Kolkata" });
// 330

getUTCOffset({ date: "2024-01-15T12:00:00Z", timeZone: "America/New_York" });
// -300

getUTCOffset({ date: "2024-07-15T12:00:00Z", timeZone: "America/New_York" });
// -240

getUTCOffset({ date: "2024-06-15T12:00:00Z", timeZone: "UTC" });
// 0
```

## Edge cases

Positive means the zone is ahead of UTC. The value can include a fraction when a historical offset is not a whole minute. Daylight saving changes the offset for the same zone. An unknown zone or a value that is not a real date throws a `RangeError`.

## Related

- [`getTimeZoneDifference`](../get-time-zone-difference/get-time-zone-difference.md)
- [`isDaylightSavingTime`](../is-daylight-saving-time/is-daylight-saving-time.md)
- [`getDateParts`](../get-date-parts/get-date-parts.md)
