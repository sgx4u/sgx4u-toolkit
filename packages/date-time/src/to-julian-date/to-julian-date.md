# `toJulianDate`

Returns the astronomical Julian Date of an instant.

## Import

```ts
import { toJulianDate } from "@sgx4u/date-time";
```

## Signature

```ts
function toJulianDate(date: DateInput): number | undefined;
```

## Parameters

| Name   | Type        | Required | Default | Meaning                 |
| ------ | ----------- | -------- | ------- | ----------------------- |
| `date` | `DateInput` | yes      |         | The instant to convert. |

## Examples

```ts
toJulianDate(0);
// 2440587.5

toJulianDate(86_400_000);
// 2440588.5

toJulianDate("2000-01-01T12:00:00Z");
// 2451545

toJulianDate("2024-02-29T00:00:00Z");
// 2460369.5
```

## Edge cases

The conversion is `unixMilliseconds / 86400000 + 2440587.5`. Noon UTC is a whole Julian Date, and midnight UTC ends in `.5`. An invalid date throws `RangeError`. The input is an absolute instant.

## Related

- [`fromJulianDate`](../from-julian-date/from-julian-date.md) returns a date from a Julian Date.
- [`toUnixSeconds`](../to-unix-seconds/to-unix-seconds.md) returns whole seconds since the Unix epoch.
