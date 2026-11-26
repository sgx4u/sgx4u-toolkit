# `getNextTimeZoneTransition`

Returns the next offset change, searching up to two years ahead.

## Import

```ts
import { getNextTimeZoneTransition } from "@sgx4u/date-time";
```

## Signature

```ts
function getNextTimeZoneTransition(
    date: DateInput,
    timeZone: string,
): TimeZoneTransition | undefined;
```

## Options

This function has no options.

## Examples

```ts
import { getNextTimeZoneTransition } from "@sgx4u/date-time";

getNextTimeZoneTransition(
    "2024-03-10T00:00:00Z",
    "America/New_York",
)?.instant.toISOString();
// "2024-03-10T07:00:00.000Z"

getNextTimeZoneTransition(
    "2024-03-10T07:00:00Z",
    "America/New_York",
)?.instant.toISOString();
// "2024-11-03T06:00:00.000Z"

getNextTimeZoneTransition("2024-03-10T00:00:00Z", "UTC");
// undefined
```

## Edge cases

A transition at the exact instant is not returned. The search looks at most two years ahead and returns `undefined` when the offset does not change, which includes every fixed offset. An unknown zone throws a `RangeError`.

## Related

- [`getPreviousTimeZoneTransition`](../get-previous-time-zone-transition/get-previous-time-zone-transition.md)
- [`getTimeZoneTransitions`](../get-time-zone-transitions/get-time-zone-transitions.md)
- [`isDaylightSavingTime`](../is-daylight-saving-time/is-daylight-saving-time.md)
