# `formatDuration`

Formats a duration as text such as `1 hour, 30 minutes`.

## Import

```ts
import { formatDuration } from "@sgx4u/date-time";
```

## Signature

```ts
function formatDuration(
    duration: Duration,
    options?: FormatDurationOptions,
): string;
```

## Options

| Name     | Type                                         | Default        | Meaning                                           |
| -------- | -------------------------------------------- | -------------- | ------------------------------------------------- |
| `locale` | `string \| readonly string[]`                | Runtime locale | Locale for the unit names.                        |
| `style`  | `"long" \| "short" \| "narrow" \| "digital"` | `"long"`       | Length of the unit names. `"digital"` is a clock. |

## Examples

```ts
formatDuration({ hours: 1, minutes: 30 }, { locale: "en" });
// "1 hour, 30 minutes"

formatDuration({ hours: 1, minutes: 30 }, { locale: "en", style: "short" });
// "1 hr, 30 min"

formatDuration({ hours: -1 }, { locale: "en" });
// "-1 hour"

formatDuration({}, { locale: "en" });
// "0 seconds"
```

## Edge cases

An unknown `style` throws `RangeError`. A value that is not a duration throws `TypeError`. Mixed signs throw `RangeError`. `"digital"` uses `Intl.DurationFormat` when the runtime has it, and otherwise writes a clock such as `01:02:03`.

## Related

- [`formatDurationCompact`](../format-duration-compact/format-duration-compact.md) writes symbols such as `1h 30m`.
- [`formatDurationAsClock`](../format-duration-as-clock/format-duration-as-clock.md) writes `H:mm:ss`.
- [`formatIsoDuration`](../format-iso-duration/format-iso-duration.md) writes an ISO 8601 duration.
