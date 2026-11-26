# `compareDurations`

Compares two durations by their length in milliseconds.

## Import

```ts
import { compareDurations } from "@sgx4u/date-time";
```

## Signature

```ts
function compareDurations(
    first: Duration,
    second: Duration,
    options?: DurationToMillisecondsOptions,
): -1 | 0 | 1;
```

## Options

| Name         | Type        | Default     | Meaning                                                |
| ------------ | ----------- | ----------- | ------------------------------------------------------ |
| `relativeTo` | `DateInput` |             | Instant used when either duration has months or years. |
| `timeZone`   | `string`    | System zone | Zone used with `relativeTo`.                           |

## Examples

```ts
compareDurations({ hours: 2 }, { minutes: 90 });
// 1

compareDurations({ hours: 1, minutes: 30 }, { minutes: 90 });
// 0

compareDurations(
    { months: 1 },
    { days: 29 },
    { relativeTo: "2024-01-31T00:00:00Z", timeZone: "UTC" },
);
// 0

compareDurations(
    { months: 1 },
    { days: 28 },
    { relativeTo: "2023-01-31T00:00:00Z", timeZone: "UTC" },
);
// 0
```

## Edge cases

Without `relativeTo`, a day is 24 hours and a week is 7 days. Months or years without `relativeTo` throw `RangeError`. From 31 January 2024, one month and 29 days are the same length because February 2024 has 29 days. From 31 January 2023, one month matches 28 days. An invalid duration throws `RangeError`.

## Related

- [`durationToMilliseconds`](../duration-to-milliseconds/duration-to-milliseconds.md) returns the length this comparison uses.
- [`addDurations`](../add-durations/add-durations.md) adds two durations field by field.
