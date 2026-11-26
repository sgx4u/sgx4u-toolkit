# `fromJulianDate`

Returns a date from an astronomical Julian Date.

## Import

```ts
import { fromJulianDate } from "@sgx4u/date-time";
```

## Signature

```ts
function fromJulianDate(julianDate: number): Date;
```

## Options

This function has no options.

## Examples

```ts
fromJulianDate(2440587.5).toISOString();
// "1970-01-01T00:00:00.000Z"

fromJulianDate(2440589).toISOString();
// "1970-01-02T12:00:00.000Z"

fromJulianDate(2460369.5).toISOString();
// "2024-02-29T00:00:00.000Z"
```

## Edge cases

A non-number throws `TypeError`. `NaN` throws `RangeError`. A value outside the range `Date` can store, such as `1e20`, throws `RangeError`. The fraction is the time of day.

## Related

- [`toJulianDate`](../to-julian-date/to-julian-date.md) writes the Julian Date of an instant.
