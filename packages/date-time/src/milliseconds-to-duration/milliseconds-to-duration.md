# `millisecondsToDuration`

Splits a millisecond length into duration fields.

## Import

```ts
import { millisecondsToDuration } from "@sgx4u/date-time";
```

## Signature

```ts
function millisecondsToDuration(
    milliseconds: number,
    options?: MillisecondsToDurationOptions,
): Duration;
```

## Options

| Name           | Type                                                                 | Default         | Meaning                                                                                |
| -------------- | -------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------- |
| `largestUnit`  | `"week" \| "day" \| "hour" \| "minute" \| "second" \| "millisecond"` | `"day"`         | Largest unit in the result. `"week"` uses 7 days and `"day"` uses 24 hours.            |
| `smallestUnit` | `"hour" \| "minute" \| "second" \| "millisecond"`                    | `"millisecond"` | Smallest unit in the result. A remainder stays on this field, which may be fractional. |

## Examples

```ts
import { millisecondsToDuration } from "@sgx4u/date-time";

millisecondsToDuration(5_400_000);
// { hours: 1, minutes: 30 }

millisecondsToDuration(-5_400_000);
// { hours: -1, minutes: -30 }

millisecondsToDuration(8 * 86_400_000, { largestUnit: "week" });
// { weeks: 1, days: 1 }

millisecondsToDuration(90_000, { smallestUnit: "minute" });
// { minutes: 1.5 }
```

## Edge cases

Zero fields are omitted. The sign is applied to every field. `smallestUnit` must not be larger than `largestUnit`. A non-number throws a `TypeError`. An unknown unit throws a `RangeError`.

## Related

- [`negateDuration`](../negate-duration/negate-duration.md)
- [`isValidDuration`](../is-valid-duration/is-valid-duration.md)
- [`getIntervalDuration`](../get-interval-duration/get-interval-duration.md)
