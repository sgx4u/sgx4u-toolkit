# `durationToMilliseconds`

Returns the exact length of a duration in milliseconds.

## Import

```ts
import { durationToMilliseconds } from "@sgx4u/date-time";
```

## Signature

```ts
function durationToMilliseconds(
    params: DurationToMillisecondsParams,
): number | undefined;
```

## Parameters

| Name         | Type        | Required | Default                                  | Meaning                                                      |
| ------------ | ----------- | -------- | ---------------------------------------- | ------------------------------------------------------------ |
| `duration`   | `Duration`  | yes      |                                          | The duration to measure.                                     |
| `relativeTo` | `DateInput` | no       |                                          | The instant used when the duration contains months or years. |
| `timeZone`   | `string`    | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset           |

## Examples

```ts
durationToMilliseconds({ duration: { hours: 1, minutes: 30 } }); // 5400000
```

One month from 31 January 2026 is the length through 28 February:

```ts
durationToMilliseconds({
    duration: { months: 1 },
    relativeTo: "2026-01-31T00:00:00Z",
    timeZone: "UTC",
}); // 2419200000
```

## Edge cases

Without `relativeTo`, a day is 24 hours and a week is 7 days. Months or years without `relativeTo` throw `RangeError`.

## Related

- [`millisecondsToDuration`](../milliseconds-to-duration/milliseconds-to-duration.md)
- [`normalizeDuration`](../normalize-duration/normalize-duration.md)
