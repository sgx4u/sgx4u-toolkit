# `fromUnixSeconds`

Returns a date from whole or fractional Unix seconds.

## Import

```ts
import { fromUnixSeconds } from "@sgx4u/date-time";
```

## Signature

```ts
function fromUnixSeconds(seconds: number): Date;
```

## Options

This function has no options.

## Examples

```ts
fromUnixSeconds(0).toISOString();
// "1970-01-01T00:00:00.000Z"

fromUnixSeconds(1.5).toISOString();
// "1970-01-01T00:00:01.500Z"

fromUnixSeconds(1_709_164_800).toISOString();
// "2024-02-29T00:00:00.000Z"

fromUnixSeconds(1_767_225_600).toISOString();
// "2026-01-01T00:00:00.000Z"
```

## Edge cases

A non-number throws `TypeError`. `NaN` throws `RangeError`. A value outside the range `Date` can store, such as `1e16` seconds, throws `RangeError`. A fractional second becomes milliseconds.

## Related

- [`toUnixSeconds`](../to-unix-seconds/to-unix-seconds.md) writes Unix seconds for an instant.
