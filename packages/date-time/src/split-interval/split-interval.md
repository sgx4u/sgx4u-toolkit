# `splitInterval`

Splits an interval into consecutive pieces of a step.

## Import

```ts
import { splitInterval } from "@sgx4u/date-time";
```

## Signature

```ts
function splitInterval(params: SplitIntervalParams): Interval[] | undefined;
```

## Parameters

| Name       | Type        | Required | Default                                  | Meaning                                                 |
| ---------- | ----------- | -------- | ---------------------------------------- | ------------------------------------------------------- |
| `start`    | `DateInput` | yes      |                                          | The inclusive start of the half-open interval to split. |
| `end`      | `DateInput` | yes      |                                          | The exclusive end of the half-open interval to split.   |
| `step`     | `Duration`  | yes      |                                          | A positive duration for each piece except the last.     |
| `timeZone` | `string`    | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset      |

## Examples

```ts
splitInterval({
    interval: { start: new Date(0), end: new Date(10) },
    step: { milliseconds: 4 },
});
// [
//   { start: new Date(0), end: new Date(4) },
//   { start: new Date(4), end: new Date(8) },
//   { start: new Date(8), end: new Date(10) },
// ]

splitInterval({
    interval: { start: new Date(0), end: new Date(0) },
    step: { milliseconds: 4 },
});
// []

splitInterval({
    interval: {
        start: new Date("2026-01-31T00:00:00Z"),
        end: new Date("2026-03-15T00:00:00Z"),
    },
    step: { months: 1 },
    timeZone: "UTC",
}).map((piece) => [piece.start.toISOString(), piece.end.toISOString()]);
// [
//   ["2026-01-31T00:00:00.000Z", "2026-02-28T00:00:00.000Z"],
//   ["2026-02-28T00:00:00.000Z", "2026-03-15T00:00:00.000Z"],
// ]
```

## Edge cases

The last piece is shorter when the interval does not divide evenly. An empty interval returns `[]`. A zero or negative step throws `RangeError`. More than 100000 pieces throws `RangeError`. An invalid interval throws `RangeError`.

Hours and smaller units are elapsed time. Days, weeks, and months step on the wall clock in `timeZone`. One calendar day across the 2024 spring-forward in `America/New_York` is 23 hours: the piece that starts at `2024-03-09T14:00:00.000Z` ends at `2024-03-10T13:00:00.000Z`. A month step clamps a missing day, so January 31 plus one month in a non-leap year lands on February 28.

## Related

- [`divideInterval`](../divide-interval/divide-interval.md) splits an interval into equal parts.
- [`listDatesInInterval`](../list-dates-in-interval/list-dates-in-interval.md) lists the dates inside an interval.
- [`getIntervalDuration`](../get-interval-duration/get-interval-duration.md) returns the length of an interval.
