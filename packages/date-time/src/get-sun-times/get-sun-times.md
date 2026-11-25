# `getSunTimes`

Returns sunrise, sunset, solar noon, and civil twilight for one civil day.

## Import

```ts
import { getSunTimes } from "@sgx4u/date-time/astronomy";
```

## Signature

```ts
function getSunTimes(
    date: DateInput,
    location: { latitude: number; longitude: number },
    options?: TimeZoneOptions,
): SunTimes;
```

## Examples

On the March equinox at latitude 0 and longitude 0, sunrise is a few minutes from 06:00 UTC and solar noon is between sunrise and sunset.

## Edge cases

`sunrise` and `sunset` are absent in polar day and polar night. Latitude must be -90 through 90 and longitude -180 through 180.

## Related

- [`getMoonPhase`](../get-moon-phase/get-moon-phase.md)
