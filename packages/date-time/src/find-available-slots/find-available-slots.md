# `findAvailableSlots`

Finds free slots of a fixed length inside a window.

## Import

```ts
import { findAvailableSlots } from "@sgx4u/date-time";
```

## Signature

```ts
function findAvailableSlots(
    params: FindAvailableSlotsParams,
): Interval[] | undefined;
```

## Parameters

| Name           | Type                  | Required | Default                                  | Meaning                                                               |
| -------------- | --------------------- | -------- | ---------------------------------------- | --------------------------------------------------------------------- |
| `busy`         | `readonly Interval[]` | yes      |                                          | Intervals that are already taken.                                     |
| `within`       | `Interval`            | yes      |                                          | The window that may contain slots.                                    |
| `slotDuration` | `Duration`            | yes      |                                          | The exact length of every returned slot.                              |
| `step`         | `Duration`            | no       |                                          | How far the start of the next slot moves. Defaults to `slotDuration`. |
| `dailyWindow`  | `TimeRange`           | no       |                                          | When set, a slot must lie inside this window on its calendar day.     |
| `timeZone`     | `string`              | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset                    |

## Examples

```ts
findAvailableSlots({
    busy: [{ start: new Date(10), end: new Date(20) }],
    within: { start: new Date(0), end: new Date(40) },
    slotDuration: { milliseconds: 10 },
    timeZone: "UTC",
}).map((slot) => [slot.start.getTime(), slot.end.getTime()]);
// [[0, 10], [20, 30], [30, 40]]

findAvailableSlots({
    busy: [],
    within: {
        start: new Date("2026-11-26T08:00:00Z"),
        end: new Date("2026-11-26T18:00:00Z"),
    },
    slotDuration: { hours: 1 },
    dailyWindow: { start: "09:00", end: "17:00" },
    timeZone: "UTC",
})[0]?.start.toISOString();
// "2026-11-26T09:00:00.000Z"
```

The last slot in that daily window ends at `2026-11-26T17:00:00.000Z`.

## Edge cases

Busy intervals are merged. A slot must fit entirely in free time and inside `within`. A daily window drops a slot that starts before the window or ends after it. A step or slot duration that does not move time forward throws `RangeError`. More than 100000 slots throws `RangeError`. `busy` must be an array.

## Related

- [`mergeIntervals`](../merge-intervals/merge-intervals.md) joins the busy intervals before the search.
- [`doIntervalsOverlap`](../do-intervals-overlap/do-intervals-overlap.md) is the overlap test used to skip busy time.
- [`isWithinInterval`](../is-within-interval/is-within-interval.md) tests an instant against a window.
