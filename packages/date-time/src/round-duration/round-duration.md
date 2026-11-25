# `roundDuration`

Rounds a duration to a unit. 90 minutes nearest to an hour is 2 hours.

## Import

```ts
import { roundDuration } from "@sgx4u/date-time";
```

## Examples

See the TSDoc example on `roundDuration`.

## Edge cases

A zero or negative step throws `RangeError`. Results stop at 100000 entries.

## Related

- [`addDuration`](../add-duration/add-duration.md)
