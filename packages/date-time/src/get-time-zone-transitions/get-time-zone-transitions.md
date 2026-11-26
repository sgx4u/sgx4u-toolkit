# `getTimeZoneTransitions`

Returns every offset change inside an interval.

## Import

```ts
import { getTimeZoneTransitions } from "@sgx4u/date-time";
```

## Signature

```ts
function getTimeZoneTransitions(
    interval: Interval,
    timeZone: string,
): TimeZoneTransition[];
```

## Options

This function has no options.

## Examples

```ts
import { getTimeZoneTransitions } from "@sgx4u/date-time";

getTimeZoneTransitions(
    {
        start: new Date("2024-03-10T00:00:00Z"),
        end: new Date("2024-03-11T00:00:00Z"),
    },
    "America/New_York",
)[0]?.instant.toISOString();
// "2024-03-10T07:00:00.000Z"

getTimeZoneTransitions(
    {
        start: new Date("2024-01-01T00:00:00Z"),
        end: new Date("2025-01-01T00:00:00Z"),
    },
    "America/New_York",
).length;
// 2

getTimeZoneTransitions(
    {
        start: new Date("2024-01-01T00:00:00Z"),
        end: new Date("2025-01-01T00:00:00Z"),
    },
    "UTC",
).length;
// 0
```

## Edge cases

Transitions are oldest first. The interval is half-open. A fixed offset contributes nothing. An interval longer than 50 years throws a `RangeError`, as does an unknown zone.

## Related

- [`getNextTimeZoneTransition`](../get-next-time-zone-transition/get-next-time-zone-transition.md)
- [`getPreviousTimeZoneTransition`](../get-previous-time-zone-transition/get-previous-time-zone-transition.md)
- [`getWallTimeStatus`](../get-wall-time-status/get-wall-time-status.md)
