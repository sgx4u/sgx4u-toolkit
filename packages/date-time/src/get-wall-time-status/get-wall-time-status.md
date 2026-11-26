# `getWallTimeStatus`

Reports whether a wall time exists once, never, or twice.

## Import

```ts
import { getWallTimeStatus } from "@sgx4u/date-time";
```

## Signature

```ts
function getWallTimeStatus(
    parts: DatePartsInput,
    timeZone: string,
): WallTimeStatus;
```

## Options

This function has no options.

## Examples

```ts
import { getWallTimeStatus } from "@sgx4u/date-time";

getWallTimeStatus(
    { year: 2024, month: 3, day: 10, hour: 2, minute: 30 },
    "America/New_York",
);
// "skipped"

getWallTimeStatus(
    { year: 2024, month: 11, day: 3, hour: 1, minute: 30 },
    "America/New_York",
);
// "repeated"

getWallTimeStatus(
    { year: 2024, month: 6, day: 15, hour: 12 },
    "America/New_York",
);
// "valid"
```

## Edge cases

`"skipped"` is a spring-forward gap, `"repeated"` is a fall-back overlap, and `"valid"` exists once. Omitted clock fields default to 0, and an omitted month or day defaults to 1. A calendar day that does not exist, or an unknown zone, throws a `RangeError`.

## Related

- [`getDateParts`](../get-date-parts/get-date-parts.md)
- [`getNextTimeZoneTransition`](../get-next-time-zone-transition/get-next-time-zone-transition.md)
- [`isDaylightSavingTime`](../is-daylight-saving-time/is-daylight-saving-time.md)
