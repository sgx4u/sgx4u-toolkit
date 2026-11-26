# `fromJulianDate`

Returns a date from an astronomical Julian Date.

## Import

```ts
import { fromJulianDate } from "@sgx4u/date-time";
```

## Signature

```ts
function fromJulianDate(julianDate: number): Date | undefined;
```

## Options

This function has no options. Pass `julianDate` as the only argument.

## Examples

```ts
fromJulianDate(2440587.5)?.toISOString();
// "1970-01-01T00:00:00.000Z" 
```

## Edge cases

A non-finite `julianDate`, or a value outside the range `Date` can store, returns `undefined`.


## Related

- [`toJulianDate`](../to-julian-date/to-julian-date.md) writes the Julian Date of an instant.
