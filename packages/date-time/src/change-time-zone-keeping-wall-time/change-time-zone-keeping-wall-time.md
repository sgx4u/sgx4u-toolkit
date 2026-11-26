# `changeTimeZoneKeepingWallTime`

Keeps the clock reading of an instant and places that same reading in another time zone.

## Import

```ts
import { changeTimeZoneKeepingWallTime } from "@sgx4u/date-time";
```

## Signature

```ts
function changeTimeZoneKeepingWallTime(
    date: DateInput,
    fromTimeZone: string,
    toTimeZone: string,
    options?: DisambiguationOptions,
): Date;
```

## Options

| Name             | Type                                               | Default        | Meaning                                                                 |
| ---------------- | -------------------------------------------------- | -------------- | ----------------------------------------------------------------------- |
| `disambiguation` | `"compatible" \| "earlier" \| "later" \| "reject"` | `"compatible"` | How a skipped or repeated wall time in the destination zone is resolved |

## Examples

03:30 in Asia/Kolkata kept as a wall time in UTC is 03:30Z:

```ts
changeTimeZoneKeepingWallTime(
    "2026-11-26T03:30:00+05:30",
    "Asia/Kolkata",
    "UTC",
).toISOString(); // "2026-11-26T03:30:00.000Z"
```

A 09:00 meeting moved from Kolkata to London is still 09:00 on the clock, at a different instant.

## Edge cases

An unknown zone throws `RangeError`. `disambiguation: "reject"` throws when the same clock time is skipped or repeated in the destination zone.

## Related

- [`getUtcOffset`](../get-utc-offset/get-utc-offset.md)
- [`getTimeZoneDifference`](../get-time-zone-difference/get-time-zone-difference.md)
