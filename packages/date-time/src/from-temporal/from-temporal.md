# `fromTemporal`

Returns a `Date` from an object that has a finite `epochMilliseconds`.

## Import

```ts
import { fromTemporal } from "@sgx4u/date-time";
```

## Signature

```ts
function fromTemporal(value: TemporalInstantLike): Date | undefined;
```

## Options

This function has no options. Pass `value` as the only argument.

## Examples

```ts
fromTemporal({ epochMilliseconds: 0 })?.toISOString();
// "1970-01-01T00:00:00.000Z" 
```

## Edge cases

An object without a finite `epochMilliseconds` returns `undefined`.


## Related

- [`toTemporalInstant`](../to-temporal-instant/to-temporal-instant.md) reads the epoch milliseconds back out.
