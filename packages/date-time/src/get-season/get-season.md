# `getSeason`

Returns the season for a date.

## Import

```ts
import { getSeason } from "@sgx4u/date-time";
```

## Signature

```ts
function getSeason(params: GetSeasonParams): Season | undefined;
```

## Parameters

| Name         | Type                                 | Required | Default                                  | Meaning                                                                  |
| ------------ | ------------------------------------ | -------- | ---------------------------------------- | ------------------------------------------------------------------------ |
| `date`       | `DateInput`                          | yes      |                                          | The date to classify.                                                    |
| `hemisphere` | `"northern" \| "southern"`           | no       | `"northern"`                             | The southern hemisphere shifts the meteorological seasons by six months. |
| `method`     | `"meteorological" \| "astronomical"` | no       | `"meteorological"`                       | Meteorological seasons follow calendar months. Astronomical seasons      |
| `timeZone`   | `string`                             | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset                       |

## Examples

```ts
import { getSeason } from "@sgx4u/date-time";

getSeason({ date: "2026-07-01T00:00:00Z", timeZone: "UTC" });
// "summer"

getSeason({
    date: "2026-07-01T00:00:00Z",
    timeZone: "UTC",
    hemisphere: "southern",
});
// "winter"

getSeason({ date: "2026-03-01T00:00:00Z", timeZone: "UTC" });
// "spring"

getSeason({
    date: "2026-03-01T00:00:00Z",
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
