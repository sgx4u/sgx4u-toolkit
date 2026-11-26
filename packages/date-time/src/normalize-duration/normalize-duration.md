# `normalizeDuration`

Balances a duration so smaller units do not overflow. `90` minutes becomes `1` hour and `30` minutes.

## Import

```ts
import { normalizeDuration } from "@sgx4u/date-time";
```

## Signature

```ts
function normalizeDuration(
    params: NormalizeDurationParams,
): Duration | undefined;
```

## Parameters

| Name          | Type        | Required | Default                                  | Meaning                                                                |
| ------------- | ----------- | -------- | ---------------------------------------- | ---------------------------------------------------------------------- |
| `duration`    | `Duration`  | yes      |                                          | The duration to balance.                                               |
| `largestUnit` | `TimeUnit`  | no       | `"day"`                                  | The largest unit the clock fields may carry into. Months and years are |
| `relativeTo`  | `DateInput` | no       |                                          | The instant used when balancing on the calendar. Without it, a day is  |
| `timeZone`    | `string`    | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset                     |

## Examples

```ts
normalizeDuration({ duration: { minutes: 90 } }); // { hours: 1, minutes: 30 }
normalizeDuration({ duration: { hours: 26 } }); // { days: 1, hours: 2 }
```

## Edge cases

Months and years are left as they are when `relativeTo` is omitted. A negative duration keeps its sign.

## Related

- [`addDurations`](../add-durations/add-durations.md)
- [`formatDurationCompact`](../format-duration-compact/format-duration-compact.md)
