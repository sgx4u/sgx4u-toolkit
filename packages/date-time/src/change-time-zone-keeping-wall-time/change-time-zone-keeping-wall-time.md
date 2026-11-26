# `changeTimeZoneKeepingWallTime`

Keeps the clock reading of an instant and places that same reading in another time zone.

## Import

```ts
import { changeTimeZoneKeepingWallTime } from "@sgx4u/date-time";
```

## Signature

```ts
function changeTimeZoneKeepingWallTime(
    params: ChangeTimeZoneKeepingWallTimeParams,
): Date | undefined;
```

## Options

| Name             | Type                                               | Required | Default        | Meaning                                      |
| ---------------- | -------------------------------------------------- | -------- | -------------- | -------------------------------------------- |
| `date`           | `DateInput`                                        | yes      |                | Original instant.                            |
| `fromTimeZone`   | `string`                                           | yes      |                | Zone the clock reading is taken from.        |
| `toTimeZone`     | `string`                                           | yes      |                | Zone that should show the same clock reading. |
| `disambiguation` | `"compatible" \| "earlier" \| "later" \| "reject"` | no       | `"compatible"` | Gap and overlap handling in the destination. |

## Examples

```ts
changeTimeZoneKeepingWallTime({
    date: "2026-11-26T03:30:00+05:30",
    fromTimeZone: "Asia/Kolkata",
    toTimeZone: "UTC",
})?.toISOString();
// "2026-11-26T03:30:00.000Z"
```

## Edge cases

A bad `date` returns `undefined`. An unknown zone throws `RangeError`. An unknown `disambiguation` throws `RangeError`. `disambiguation: "reject"` throws when the same clock time is skipped or repeated in the destination zone.

## Related

- [`getUTCOffset`](../get-utc-offset/get-utc-offset.md) reads the offset at an instant.
- [`createDate`](../create-date/create-date.md) builds an instant from wall-clock fields.