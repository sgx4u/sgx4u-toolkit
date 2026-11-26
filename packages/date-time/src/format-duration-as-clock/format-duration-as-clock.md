# `formatDurationAsClock`

Formats a duration as `H:mm:ss` for a timer.

## Import

```ts
import { formatDurationAsClock } from "@sgx4u/date-time";
```

## Signature

```ts
function formatDurationAsClock(
    duration: Duration | number,
    options?: FormatDurationAsClockOptions,
): string;
```

## Options

| Name               | Type      | Default | Meaning                            |
| ------------------ | --------- | ------- | ---------------------------------- |
| `alwaysShowHours`  | `boolean` | `true`  | Whether a zero hour field is kept. |
| `showMilliseconds` | `boolean` | `false` | Whether milliseconds are appended. |

## Examples

```ts
formatDurationAsClock({ hours: 1, minutes: 2, seconds: 3 });
// "01:02:03"

formatDurationAsClock(0);
// "00:00:00"

formatDurationAsClock(
    { minutes: 1, seconds: 2, milliseconds: 3 },
    { alwaysShowHours: false, showMilliseconds: true },
);
// "01:02.003"

formatDurationAsClock(-3_661_000);
// "-01:01:01"
```

## Edge cases

Hours are padded to two digits. Hours beyond 99 print in full, so 100 hours is `"100:01:02"`. A negative duration has a leading `-`. One day is `"24:00:00"`. A string throws `TypeError`. `NaN` and `Infinity` throw `RangeError`.

## Related

- [`formatDurationCompact`](../format-duration-compact/format-duration-compact.md) writes compact unit symbols.
- [`formatDuration`](../format-duration/format-duration.md) writes localized unit names.
