# `listRecurrenceOccurrences`

Lists occurrences in an interval. A day that does not exist is skipped.

## Import

```ts
import { listRecurrenceOccurrences } from "@sgx4u/date-time/recurrence";
```

## Examples

A weekly rule starting Thursday 26 November 2026 at 09:00 UTC, every 2 weeks on Monday and Friday, produces 27 November, 7 December, and 11 December inside that window.

## Edge cases

`RSCALE` and `SKIP` return `undefined`. `count` and `until` together are rejected. More occurrences than `limit` throws `RangeError`.

## Related

- [`parseRecurrenceRule`](../parse-recurrence-rule/parse-recurrence-rule.md)
