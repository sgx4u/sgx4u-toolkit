# `getMoonPhase`

Returns the moon phase at an instant.

## Import

```ts
import { getMoonPhase } from "@sgx4u/date-time/astronomy";
```

## Signature

```ts
function getMoonPhase(date: DateInput): MoonPhase | undefined;
```

## Parameters

| Name   | Type        | Required | Default | Meaning                 |
| ------ | ----------- | -------- | ------- | ----------------------- |
| `date` | `DateInput` | yes      |         | The instant to measure. |

## Examples

```ts
import { getMoonPhase } from "@sgx4u/date-time/astronomy";

getMoonPhase("2000-01-06T18:14:00.000Z").name;
// "new-moon"

getMoonPhase("2000-01-13T18:14:00.000Z").name;
// "first-quarter"

getMoonPhase("2000-01-21T12:36:00.000Z").name;
// "full-moon"
```

## Edge cases

`fraction` is in `[0, 1)`, measured from the 2000-01-06 18:14 UTC new moon with a 29.530588853-day month. The eight names are equal parts of that cycle, centred on new moon, first quarter, full moon, and last quarter. A value that is not a real date returns `undefined`.

## Related

- [`getSunTimes`](../get-sun-times/get-sun-times.md)
- [`getSeason`](../get-season/get-season.md)
