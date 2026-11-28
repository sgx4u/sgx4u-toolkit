# `addDuration`

Adds a duration, moving calendar units on the wall clock and clock units as elapsed time.

## Import

```ts
import { addDuration } from "@sgx4u/date-time";
```

## Signature

```ts
function addDuration(params: AddDurationParams): Date | undefined;
```

## Parameters

| Name             | Type             | Required | Default                                  | Meaning                                                     |
| ---------------- | ---------------- | -------- | ---------------------------------------- | ----------------------------------------------------------- |
| `date`           | `DateInput`      | yes      |                                          | The starting instant.                                       |
| `duration`       | `Duration`       | yes      |                                          | The length to add. Every field must share one sign.         |
| `overflow`       | `Overflow`       | no       | `"constrain"`                            | What to do when the day does not exist in the target month. |
| `timeZone`       | `string`         | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset          |
| `disambiguation` | `Disambiguation` | no       | `"compatible"`                           | Which instant to use at a daylight-saving gap or overlap.   |

## Examples

```ts
addDuration({
    date: "2026-01-31T00:00:00Z",
    duration: { months: 1 },
    timeZone: "UTC",
}).toISOString();
// "2026-02-28T00:00:00.000Z"

addDuration({
    date: "2024-03-09T14:00:00Z",
    duration: { days: 1 },
    timeZone: "America/New_York",
}).toISOString();
// "2024-03-10T13:00:00.000Z"

addDuration({
    date: "2024-03-09T14:00:00Z",
    duration: { hours: 24 },
    timeZone: "America/New_York",
}).toISOString();
// "2024-03-10T14:00:00.000Z"
```

## Edge cases

January 31 plus one month is February 28, or February 29 in a leap year, when `overflow` is `"constrain"`. `"reject"` throws `RangeError` for that missing day. One calendar day and 24 hours differ across a daylight-saving change: the day keeps the wall time, and the hours are elapsed time. A skipped or repeated wall time follows `disambiguation`. `"reject"` throws on a gap or overlap. A duration whose fields do not share one sign returns `undefined`. The input date is not mutated.

## Related

- [`subtractDuration`](../subtract-duration/subtract-duration.md) adds the negated duration.
- [`differenceAsDuration`](../difference-as-duration/difference-as-duration.md) breaks the distance between two instants into a duration.
- [`addDurations`](../add-durations/add-durations.md) adds two durations field by field.
