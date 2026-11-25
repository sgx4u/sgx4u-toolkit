# `parseDateWithPattern`

See the TSDoc on `parseDateWithPattern` for the contract.

## Import

```ts
import { parseDateWithPattern } from "@sgx4u/date-time";
```

## Examples

A padded pattern such as `yyyy-MM-dd HH:mm:ss.SSS` round-trips through `formatDate`. `2026-02-30` does not parse.

## Edge cases

An unknown token throws `RangeError`. An impossible day returns `undefined`. Missing time fields become zero when the pattern contains a date field.

## Related

- [`formatDate`](../format-date/format-date.md)
