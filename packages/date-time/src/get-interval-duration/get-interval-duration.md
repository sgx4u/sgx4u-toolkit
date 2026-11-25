# `getIntervalDuration`

Returns the length of an interval as a duration that adds back to the end.

## Import

```ts
import { getIntervalDuration } from "@sgx4u/date-time";
```

## Examples

See the TSDoc example on `getIntervalDuration`.

## Edge cases

A zero or negative step throws `RangeError`. Results stop at 100000 entries.

## Related

- [`addDuration`](../add-duration/add-duration.md)
