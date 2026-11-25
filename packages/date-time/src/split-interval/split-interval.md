# `splitInterval`

Splits a half-open interval into consecutive steps. The last piece may be shorter. A zero step throws.

## Import

```ts
import { splitInterval } from "@sgx4u/date-time";
```

## Examples

See the TSDoc example on `splitInterval`.

## Edge cases

A zero or negative step throws `RangeError`. Results stop at 100000 entries.

## Related

- [`addDuration`](../add-duration/add-duration.md)
