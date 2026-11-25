# `listDatesInInterval`

Lists dates from the start up to, but not including, the end. The default step is one day.

## Import

```ts
import { listDatesInInterval } from "@sgx4u/date-time";
```

## Examples

See the TSDoc example on `listDatesInInterval`.

## Edge cases

A zero or negative step throws `RangeError`. Results stop at 100000 entries.

## Related

- [`addDuration`](../add-duration/add-duration.md)
