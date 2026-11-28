# `getPreviousTimeZoneTransition`

Returns the previous offset change, searching up to two years back.

## Import

```ts
import { getPreviousTimeZoneTransition } from "@sgx4u/date-time";
```

## Signature

```ts
function getPreviousTimeZoneTransition(
    params: GetPreviousTimeZoneTransitionParams,
): TimeZoneTransition | undefined;
```

## Parameters

| Name       | Type        | Required | Default | Meaning                                                                         |
| ---------- | ----------- | -------- | ------- | ------------------------------------------------------------------------------- |
| `date`     | `DateInput` | yes      |         | The instant to search from. A transition at this exact instant is not returned. |
| `timeZone` | `string`    | yes      |         | An IANA name or a fixed offset.                                                 |

## Examples

```ts
import { getPreviousTimeZoneTransition } from "@sgx4u/date-time";

getPreviousTimeZoneTransition({
    date: "2024-03-11T00:00:00Z",
    timeZone: "America/New_York",
})?.instant.toISOString();
// "2024-03-10T07:00:00.000Z"

getPreviousTimeZoneTransition({
    date: "2024-11-04T00:00:00Z",
    timeZone: "America/New_York",
})?.instant.toISOString();
// "2024-11-03T06:00:00.000Z"

getPreviousTimeZoneTransition({
    date: "2024-06-01T00:00:00Z",
    timeZone: "+05:30",
});
// undefined
```

## Edge cases

A transition at the exact instant is not returned. The search looks at most two years back. A fixed offset never changes, so the result is `undefined`. An unknown zone throws a `RangeError`.

## Related

- [`getNextTimeZoneTransition`](../get-next-time-zone-transition/get-next-time-zone-transition.md)
- [`getTimeZoneTransitions`](../get-time-zone-transitions/get-time-zone-transitions.md)
- [`getUTCOffset`](../get-utc-offset/get-utc-offset.md)
