# `addDurations`

Adds two durations field by field and omits fields that sum to zero.

## Import

```ts
import { addDurations } from "@sgx4u/date-time";
```

## Signature

```ts
function addDurations(first: Duration, second: Duration): Duration;
```

## Options

This function has no options.

## Examples

```ts
addDurations({ hours: 1 }, { minutes: 30 });
// { hours: 1, minutes: 30 }

addDurations({ hours: 2 }, { hours: -1 });
// { hours: 1 }

addDurations({ months: 11 }, { months: 1 });
// { months: 12 }

addDurations({ hours: 1 }, { hours: -1 });
// {}
```

## Edge cases

The sum must share one sign. `{ hours: 1 }` plus `{ days: -1 }` throws `RangeError`. A value that is not a duration throws `TypeError`. Months are not carried into years: 11 months plus 1 month is 12 months.

## Related

- [`addDuration`](../add-duration/add-duration.md) applies a duration to a date.
- [`negateDuration`](../negate-duration/negate-duration.md) flips the sign of every field.
- [`formatDuration`](../format-duration/format-duration.md) writes a duration as text.
