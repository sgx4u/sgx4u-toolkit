# `addDuration`

Adds a duration, moving calendar units on the wall clock and clock units as elapsed time.

## Import

```ts
import { addDuration } from "@sgx4u/date-time";
```

## Signature

```ts
function addDuration(
    date: DateInput,
    duration: Duration,
    options?: AddDurationOptions,
): Date;
```

## Options

| Name             | Type                                               | Default        | Meaning                                  |
| ---------------- | -------------------------------------------------- | -------------- | ---------------------------------------- |
| `timeZone`       | `string`                                           | System zone    | IANA name or fixed offset.               |
| `disambiguation` | `"compatible" \| "earlier" \| "later" \| "reject"` | `"compatible"` | How to treat a skipped or repeated time. |
| `overflow`       | `"constrain" \| "reject"`                          | `"constrain"`  | What to do when the day is missing.      |

## Examples

```ts
addDuration(
    "2026-01-31T00:00:00Z",
    { months: 1 },
    { timeZone: "UTC" },
).toISOString();
// "2026-02-28T00:00:00.000Z"

addDuration(
    "2024-03-09T14:00:00Z",
    { days: 1 },
    { timeZone: "America/New_York" },
).toISOString();
// "2024-03-10T13:00:00.000Z"

addDuration(
    "2024-03-09T14:00:00Z",
    { hours: 24 },
    { timeZone: "America/New_York" },
).toISOString();
// "2024-03-10T14:00:00.000Z"
```

## Edge cases

January 31 plus one month is February 28, or February 29 in a leap year, when `overflow` is `"constrain"`. `"reject"` throws `RangeError` for that missing day. One calendar day and 24 hours differ across a daylight-saving change: the day keeps the wall time, and the hours are elapsed time. A skipped or repeated wall time follows `disambiguation`. `"reject"` throws on a gap or overlap. Mixed signs in one duration throw `RangeError`. The input date is not mutated.

## Related

- [`subtractDuration`](../subtract-duration/subtract-duration.md) adds the negated duration.
- [`differenceAsDuration`](../difference-as-duration/difference-as-duration.md) breaks the distance between two instants into a duration.
- [`addDurations`](../add-durations/add-durations.md) adds two durations field by field.
