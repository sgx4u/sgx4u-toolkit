# `addDurations`

Adds two durations field by field and omits fields that sum to zero.

## Import

```ts
import { addDurations } from "@sgx4u/date-time";
```

## Signature

```ts
function addDurations(params: AddDurationsParams): Duration | undefined;
```

## Options

| Name     | Type       | Required | Default | Meaning            |
| -------- | ---------- | -------- | ------- | ------------------ |
| `first`  | `Duration` | yes      |         | First duration.    |
| `second` | `Duration` | yes      |         | Second duration.   |

## Examples

```ts
addDurations({ first: { hours: 1 }, second: { minutes: 30 } });
// { hours: 1, minutes: 30 }

addDurations({ first: { months: 11 }, second: { months: 1 } });
// { months: 12 }
```

## Edge cases

The sum must share one sign. `{ hours: 1 }` plus `{ days: -1 }` throws `RangeError`. A duration that is not usable returns `undefined`. Months are not carried into years: 11 months plus 1 month is 12 months.

## Related

- [`addDuration`](../add-duration/add-duration.md) applies a duration to a date.
- [`negateDuration`](../negate-duration/negate-duration.md) flips the sign of every field.