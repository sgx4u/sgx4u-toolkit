# `getUtcOffset`

Returns the offset from UTC, in minutes, for an instant in a zone.

## Import

```ts
import { getUtcOffset } from "@sgx4u/date-time";
```

## Signature

```ts
function getUtcOffset(date: DateInput, timeZone: string): number;
```

## Options

This function has no options.

## Examples

```ts
import { getUtcOffset } from "@sgx4u/date-time";

getUtcOffset("2024-06-15T12:00:00Z", "Asia/Kolkata");
// 330

getUtcOffset("2024-01-15T12:00:00Z", "America/New_York");
// -300

getUtcOffset("2024-07-15T12:00:00Z", "America/New_York");
// -240

getUtcOffset("2024-06-15T12:00:00Z", "UTC");
// 0
```

## Edge cases

Positive means the zone is ahead of UTC. The value can include a fraction when a historical offset is not a whole minute. Daylight saving changes the offset for the same zone. An unknown zone or a value that is not a real date throws a `RangeError`.

## Related

- [`getTimeZoneDifference`](../get-time-zone-difference/get-time-zone-difference.md)
- [`isDaylightSavingTime`](../is-daylight-saving-time/is-daylight-saving-time.md)
- [`getDateParts`](../get-date-parts/get-date-parts.md)
