# `fromUnixSeconds`

Returns a date from whole or fractional Unix seconds.

## Import

```ts
import { fromUnixSeconds } from "@sgx4u/date-time";
```

## Signature

```ts
function fromUnixSeconds(seconds: number): Date | undefined;
```

## Options

This function has no options. Pass `seconds` as the only argument.

## Examples

```ts
fromUnixSeconds(0)?.toISOString();
// "1970-01-01T00:00:00.000Z" 
```

## Edge cases

A non-finite value, or seconds outside the range `Date` can store, returns `undefined`.


## Related

- [`toUnixSeconds`](../to-unix-seconds/to-unix-seconds.md) writes Unix seconds for an instant.
