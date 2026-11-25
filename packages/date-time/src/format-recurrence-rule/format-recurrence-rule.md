# `formatRecurrenceRule`

Writes a rule as RFC 5545 text.

## Import

```ts
import { formatRecurrenceRule } from "@sgx4u/date-time/recurrence";
```

## Examples

A weekly rule starting Thursday 26 November 2026 at 09:00 UTC, every 2 weeks on Monday and Friday, produces 27 November, 7 December, and 11 December inside that window.

## Edge cases

`RSCALE` and `SKIP` return `undefined`. `count` and `until` together are rejected. More occurrences than `limit` throws `RangeError`.

## Related

- [`parseRecurrenceRule`](../parse-recurrence-rule/parse-recurrence-rule.md)
