# `getPreviousTimeZoneTransition`

Returns the previous offset change, searching up to two years back.

## Import

```ts
import { getPreviousTimeZoneTransition } from "@sgx4u/date-time";
```

## Signature

```ts
function getPreviousTimeZoneTransition(
    date: DateInput,
    timeZone: string,
): TimeZoneTransition | undefined;
```

## Options

This function has no options.

## Examples

```ts
import { getPreviousTimeZoneTransition } from "@sgx4u/date-time";

getPreviousTimeZoneTransition(
    "2024-03-11T00:00:00Z",
    "America/New_York",
)?.instant.toISOString();
// "2024-03-10T07:00:00.000Z"

getPreviousTimeZoneTransition(
    "2024-11-04T00:00:00Z",
    "America/New_York",
)?.instant.toISOString();
// "2024-11-03T06:00:00.000Z"

getPreviousTimeZoneTransition("2024-06-01T00:00:00Z", "+05:30");
// undefined
```

## Edge cases

A transition at the exact instant is not returned. The search looks at most two years back. A fixed offset never changes, so the result is `undefined`. An unknown zone throws a `RangeError`.

## Related

- [`getNextTimeZoneTransition`](../get-next-time-zone-transition/get-next-time-zone-transition.md)
- [`getTimeZoneTransitions`](../get-time-zone-transitions/get-time-zone-transitions.md)
- [`getUtcOffset`](../get-utc-offset/get-utc-offset.md)
