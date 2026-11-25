# `normalizeDuration`

Balances a duration so smaller units do not overflow. `90` minutes becomes `1` hour and `30` minutes.

## Import

```ts
import { normalizeDuration } from "@sgx4u/date-time";
```

## Signature

```ts
function normalizeDuration(duration: Duration, options?: NormalizeDurationOptions): Duration;
```

## Options

| Name | Type | Default | Meaning |
| --- | --- | --- | --- |
| `largestUnit` | `TimeUnit` | `"day"` | The largest unit clock fields may carry into. |
| `relativeTo` | `DateInput` | none | Reserved for calendar balancing. Without it, a day is 24 hours. |
| `timeZone` | `string` | System zone | Used when `relativeTo` is set. |

## Examples

```ts
normalizeDuration({ minutes: 90 }); // { hours: 1, minutes: 30 }
normalizeDuration({ hours: 26 }); // { days: 1, hours: 2 }
```

## Edge cases

Months and years are left as they are when `relativeTo` is omitted. A negative duration keeps its sign.

## Related

- [`addDurations`](../add-durations/add-durations.md)
- [`formatDurationCompact`](../format-duration-compact/format-duration-compact.md)
