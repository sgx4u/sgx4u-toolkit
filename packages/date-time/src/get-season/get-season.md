# `getSeason`

Returns the season for a date.

## Import

```ts
import { getSeason } from "@sgx4u/date-time";
```

## Signature

```ts
function getSeason(date: DateInput, options?: GetSeasonOptions): Season;
```

## Options

| Name         | Type                                 | Default                                 | Meaning                                                                                                         |
| ------------ | ------------------------------------ | --------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `timeZone`   | `string`                             | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`.                                            |
| `hemisphere` | `"northern" \| "southern"`           | `"northern"`                            | The southern hemisphere shifts meteorological seasons by six months.                                            |
| `method`     | `"meteorological" \| "astronomical"` | `"meteorological"`                      | Meteorological seasons follow calendar months. Astronomical seasons follow approximate equinoxes and solstices. |

## Examples

```ts
import { getSeason } from "@sgx4u/date-time";

getSeason("2026-07-01T00:00:00Z", { timeZone: "UTC" });
// "summer"

getSeason("2026-07-01T00:00:00Z", {
    timeZone: "UTC",
    hemisphere: "southern",
});
// "winter"

getSeason("2026-03-01T00:00:00Z", { timeZone: "UTC" });
// "spring"

getSeason("2026-03-01T00:00:00Z", {
    timeZone: "UTC",
    method: "astronomical",
});
// "winter"
```

## Edge cases

Northern meteorological seasons are spring in March through May, summer in June through August, autumn in September through November, and winter in December through February. Astronomical boundaries are about 20 March, 21 June, 22 September, and 21 December, accurate to about a day. An unknown hemisphere or method throws a `RangeError`.

## Related

- [`getQuarter`](../get-quarter/get-quarter.md)
- [`getSunTimes`](../get-sun-times/get-sun-times.md)
- [`getMoonPhase`](../get-moon-phase/get-moon-phase.md)
