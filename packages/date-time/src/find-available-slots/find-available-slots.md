# `findAvailableSlots`

Finds free slots of a fixed length inside a window.

## Import

```ts
import { findAvailableSlots } from "@sgx4u/date-time";
```

## Examples

A busy block from 10 to 20 inside a window from 0 to 40, with 10-millisecond slots, leaves slots at 0, 20, and 30.

## Edge cases

A daily window drops a slot that starts before the window or ends after it. A zero step throws `RangeError`.

## Related

- [`mergeIntervals`](../merge-intervals/merge-intervals.md)
