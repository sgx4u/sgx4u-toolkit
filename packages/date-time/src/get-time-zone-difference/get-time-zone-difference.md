# `getTimeZoneDifference`

Returns how many minutes the first zone is ahead of the second.

## Import

```ts
import { getTimeZoneDifference } from "@sgx4u/date-time";
```

## Signature

```ts
function getTimeZoneDifference(
    firstTimeZone: string,
    secondTimeZone: string,
    options?: TimeZoneDifferenceOptions,
): number;
```

## Options

| Name | Type        | Default          | Meaning                                    |
| ---- | ----------- | ---------------- | ------------------------------------------ |
| `at` | `DateInput` | The current time | The instant at which the offsets are read. |

## Examples

```ts
import { getTimeZoneDifference } from "@sgx4u/date-time";

getTimeZoneDifference("Asia/Kolkata", "UTC", {
    at: "2026-01-01T00:00:00Z",
});
// 330

getTimeZoneDifference("UTC", "Asia/Kolkata", {
    at: "2026-01-01T00:00:00Z",
});
// -330

getTimeZoneDifference("America/New_York", "UTC", {
    at: "2024-01-15T12:00:00Z",
});
// -300

getTimeZoneDifference("America/New_York", "UTC", {
    at: "2024-07-15T12:00:00Z",
});
// -240
```

## Edge cases

A negative result means the first zone is behind the second. The difference follows daylight saving, so it can change between winter and summer. An unknown zone throws a `RangeError`.

## Related

- [`getUTCOffset`](../get-utc-offset/get-utc-offset.md)
- [`isDaylightSavingTime`](../is-daylight-saving-time/is-daylight-saving-time.md)
- [`getNextTimeZoneTransition`](../get-next-time-zone-transition/get-next-time-zone-transition.md)
