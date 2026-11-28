# `formatDurationAsClock`

Formats a duration as `H:mm:ss` for a timer.

## Import

```ts
import { formatDurationAsClock } from "@sgx4u/date-time";
```

## Signature

```ts
function formatDurationAsClock(
    params: FormatDurationAsClockParams,
): string | undefined;
```

## Parameters

| Name               | Type                 | Required | Default | Meaning                            |
| ------------------ | -------------------- | -------- | ------- | ---------------------------------- |
| `duration`         | `number \| Duration` | yes      |         | A duration or a millisecond count. |
| `alwaysShowHours`  | `boolean`            | no       | `true`  | Whether a zero hour field is kept. |
| `showMilliseconds` | `boolean`            | no       | `false` | Whether milliseconds are appended. |

## Examples

```ts
formatDurationAsClock({ duration: { hours: 1, minutes: 2, seconds: 3 } });
// "01:02:03"

formatDurationAsClock({ duration: 0 });
// "00:00:00"

formatDurationAsClock({
    duration: { minutes: 1, seconds: 2, milliseconds: 3 },
    alwaysShowHours: false,
    showMilliseconds: true,
});
// "01:02.003"

formatDurationAsClock({ duration: -3_661_000 });
// "-01:01:01"
```

## Edge cases

Hours are padded to two digits. Hours beyond 99 print in full, so 100 hours is `"100:01:02"`. A negative duration has a leading `-`. One day is `"24:00:00"`. A string throws `TypeError`. `NaN` and `Infinity` throw `RangeError`.

## Related

- [`formatDurationCompact`](../format-duration-compact/format-duration-compact.md) writes compact unit symbols.
- [`formatDuration`](../format-duration/format-duration.md) writes localized unit names.
