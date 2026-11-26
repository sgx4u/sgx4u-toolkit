# `getNextTimeZoneTransition`

Returns the next offset change, searching up to two years ahead.

## Import

```ts
import { getNextTimeZoneTransition } from "@sgx4u/date-time";
```

## Signature

```ts
function getNextTimeZoneTransition(
    params: GetNextTimeZoneTransitionParams,
): TimeZoneTransition | undefined;
```

## Parameters

| Name       | Type        | Required | Default | Meaning                                                                         |
| ---------- | ----------- | -------- | ------- | ------------------------------------------------------------------------------- |
| `date`     | `DateInput` | yes      |         | The instant to search from. A transition at this exact instant is not returned. |
| `timeZone` | `string`    | yes      |         | An IANA name or a fixed offset.                                                 |

## Examples

```ts
import { getNextTimeZoneTransition } from "@sgx4u/date-time";

getNextTimeZoneTransition({
    date: "2024-03-10T00:00:00Z",
    timeZone: "America/New_York",
})?.instant.toISOString();
// "2024-03-10T07:00:00.000Z"

getNextTimeZoneTransition({
    date: "2024-03-10T07:00:00Z",
    timeZone: "America/New_York",
})?.instant.toISOString();
// "2024-11-03T06:00:00.000Z"

getNextTimeZoneTransition({ date: "2024-03-10T00:00:00Z", timeZone: "UTC" });
// undefined
```

## Edge cases

A transition at the exact instant is not returned. The search looks at most two years ahead and returns `undefined` when the offset does not change, which includes every fixed offset. An unknown zone throws a `RangeError`.

## Related

- [`getPreviousTimeZoneTransition`](../get-previous-time-zone-transition/get-previous-time-zone-transition.md)
- [`getTimeZoneTransitions`](../get-time-zone-transitions/get-time-zone-transitions.md)
- [`isDaylightSavingTime`](../is-daylight-saving-time/is-daylight-saving-time.md)
