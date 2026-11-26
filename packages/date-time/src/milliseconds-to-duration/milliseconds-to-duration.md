# `millisecondsToDuration`

Splits a millisecond length into duration fields.

## Import

```ts
import { millisecondsToDuration } from "@sgx4u/date-time";
```

## Signature

```ts
function millisecondsToDuration(
    params: MillisecondsToDurationParams,
): Duration | undefined;
```

## Parameters

| Name           | Type                           | Required | Default         | Meaning                                                                         |
| -------------- | ------------------------------ | -------- | --------------- | ------------------------------------------------------------------------------- |
| `milliseconds` | `number`                       | yes      |                 | The signed length in milliseconds.                                              |
| `largestUnit`  | `"week" \| "day" \| ClockUnit` | no       | `"day"`         | The largest unit in the result. `"week"` uses 7 days and `"day"` uses 24 hours. |
| `smallestUnit` | `ClockUnit`                    | no       | `"millisecond"` | The smallest unit in the result.                                                |

## Examples

```ts
import { millisecondsToDuration } from "@sgx4u/date-time";

millisecondsToDuration({ milliseconds: 5_400_000 });
// { hours: 1, minutes: 30 }

millisecondsToDuration({ milliseconds: -5_400_000 });
// { hours: -1, minutes: -30 }

millisecondsToDuration({ milliseconds: 8 * 86_400_000, largestUnit: "week" });
// { weeks: 1, days: 1 }

millisecondsToDuration({ milliseconds: 90_000, smallestUnit: "minute" });
// { minutes: 1.5 }
```

## Edge cases

Zero fields are omitted. The sign is applied to every field. `smallestUnit` must not be larger than `largestUnit`. A non-number throws a `TypeError`. An unknown unit throws a `RangeError`.

## Related

- [`negateDuration`](../negate-duration/negate-duration.md)
- [`isValidDuration`](../is-valid-duration/is-valid-duration.md)
- [`getIntervalDuration`](../get-interval-duration/get-interval-duration.md)
