# `durationToMilliseconds`

Returns the exact length of a duration in milliseconds.

## Import

```ts
import { durationToMilliseconds } from "@sgx4u/date-time";
```

## Signature

```ts
function durationToMilliseconds(
    duration: Duration,
    options?: DurationToMillisecondsOptions,
): number;
```

## Options

| Name         | Type        | Default         | Meaning                                             |
| ------------ | ----------- | --------------- | --------------------------------------------------- |
| `timeZone`   | `string`    | The system zone | Zone used when `relativeTo` is set                  |
| `relativeTo` | `DateInput` | none            | Required when the duration contains months or years |

## Examples

```ts
durationToMilliseconds({ hours: 1, minutes: 30 }); // 5400000
```

One month from 31 January 2026 is the length through 28 February:

```ts
durationToMilliseconds(
    { months: 1 },
    { relativeTo: "2026-01-31T00:00:00Z", timeZone: "UTC" },
); // 2419200000
```

## Edge cases

Without `relativeTo`, a day is 24 hours and a week is 7 days. Months or years without `relativeTo` throw `RangeError`.

## Related

- [`millisecondsToDuration`](../milliseconds-to-duration/milliseconds-to-duration.md)
- [`normalizeDuration`](../normalize-duration/normalize-duration.md)
