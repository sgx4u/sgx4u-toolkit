# `fromTemporal`

Returns a `Date` from an object that has a finite `epochMilliseconds`.

## Import

```ts
import { fromTemporal } from "@sgx4u/date-time";
```

## Signature

```ts
function fromTemporal(value: TemporalInstantLike): Date;
```

## Options

This function has no options.

## Examples

```ts
fromTemporal({ epochMilliseconds: 0 }).toISOString();
// "1970-01-01T00:00:00.000Z"

fromTemporal({ epochMilliseconds: 1_709_164_800_000 }).toISOString();
// "2024-02-29T00:00:00.000Z"
```

## Edge cases

`epochMilliseconds` must be a finite number. A missing value, `NaN`, or a non-object throws `TypeError`. The returned `Date` is a new object at that instant.

## Related

- [`toTemporalInstant`](../to-temporal-instant/to-temporal-instant.md) reads the epoch milliseconds back out.
