# `getSunTimes`

Returns sunrise, sunset, solar noon, and civil twilight for one civil day.

## Import

```ts
import { getSunTimes } from "@sgx4u/date-time/astronomy";
```

## Signature

```ts
function getSunTimes(params: GetSunTimesParams): SunTimes | undefined;
```

## Parameters

| Name       | Type          | Required | Default | Meaning |
| ---------- | ------------- | -------- | ------- | ------- |
| `date`     | `DateInput`   | yes      |         |         |
| `location` | `SunLocation` | yes      |         |         |
| `timeZone` | `string`      | no       |         |         |

## Examples

```ts
import { getSunTimes } from "@sgx4u/date-time/astronomy";

getSunTimes({
    date: "2024-03-20T12:00:00Z",
    location: { latitude: 0, longitude: 0 },
    timeZone: "UTC",
}).sunrise?.toISOString();
// "2024-03-20T06:04:01.924Z"

getSunTimes({
    date: "2024-06-21T12:00:00Z",
    location: { latitude: 40.7, longitude: -74 },
    timeZone: "America/New_York",
}).solarNoon.toISOString();
// "2024-06-21T16:57:58.186Z"

getSunTimes({
    date: "2024-06-21T12:00:00Z",
    location: { latitude: 90, longitude: 0 },
    timeZone: "UTC",
}).sunrise;
// undefined
```

## Edge cases

`date` selects the civil day in `timeZone`. Latitude must be -90 through 90 and longitude -180 through 180. `sunrise` and `sunset` are absent in polar day and polar night. At the equator on the March equinox, sunrise is near 06:04 UTC. For latitudes between -65 and 65 the result is within about one minute of the refraction-corrected sunrise.

## Related

- [`getMoonPhase`](../get-moon-phase/get-moon-phase.md)
- [`getSeason`](../get-season/get-season.md)
