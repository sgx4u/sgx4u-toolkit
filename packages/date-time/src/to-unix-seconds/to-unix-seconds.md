# `toUnixSeconds`

Returns whole seconds since the Unix epoch, rounded toward minus infinity.

## Import

```ts
import { toUnixSeconds } from "@sgx4u/date-time";
```

## Signature

```ts
function toUnixSeconds(date: DateInput): number;
```

## Options

This function has no options.

## Examples

```ts
toUnixSeconds("1970-01-01T00:00:01.900Z");
// 1

toUnixSeconds(999);
// 0

toUnixSeconds(-1);
// -1

toUnixSeconds(-1500);
// -2
```

## Edge cases

A fractional second is dropped toward minus infinity, so a negative instant moves to a more negative second. `0` and `-0` are `0`. An invalid date throws `RangeError`. The count is Unix time of the absolute instant.

## Related

- [`fromUnixSeconds`](../from-unix-seconds/from-unix-seconds.md) returns a date from Unix seconds.
- [`toJulianDate`](../to-julian-date/to-julian-date.md) returns the astronomical Julian Date.
- [`toDate`](../to-date/to-date.md) accepts a millisecond timestamp.
