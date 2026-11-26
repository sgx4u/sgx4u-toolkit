# `formatDuration`

Formats a duration as text such as `1 hour, 30 minutes`.

## Import

```ts
import { formatDuration } from "@sgx4u/date-time";
```

## Signature

```ts
function formatDuration(params: FormatDurationParams): string | undefined;
```

## Parameters

| Name       | Type                                         | Required | Default                       | Meaning                                                       |
| ---------- | -------------------------------------------- | -------- | ----------------------------- | ------------------------------------------------------------- |
| `duration` | `Duration`                                   | yes      |                               | The duration to format.                                       |
| `style`    | `"long" \| "short" \| "narrow" \| "digital"` | no       | `"long"`                      | The length of the unit names. `"digital"` is a clock.         |
| `locale`   | `string \| readonly string[]`                | no       | The runtime's default locale. | A BCP 47 language tag, or a list of tags in preference order. |

## Examples

```ts
formatDuration({ duration: { hours: 1, minutes: 30 }, locale: "en" });
// "1 hour, 30 minutes"

formatDuration({
    duration: { hours: 1, minutes: 30 },
    locale: "en",
    style: "short",
});
// "1 hr, 30 min"

formatDuration({ duration: { hours: -1 }, locale: "en" });
// "-1 hour"

formatDuration({ duration: {}, locale: "en" });
// "0 seconds"
```

## Edge cases

An unknown `style` throws `RangeError`. A value that is not a duration throws `TypeError`. Mixed signs throw `RangeError`. `"digital"` uses `Intl.DurationFormat` when the runtime has it, and otherwise writes a clock such as `01:02:03`.

## Related

- [`formatDurationCompact`](../format-duration-compact/format-duration-compact.md) writes symbols such as `1h 30m`.
- [`formatDurationAsClock`](../format-duration-as-clock/format-duration-as-clock.md) writes `H:mm:ss`.
- [`formatISODuration`](../format-iso-duration/format-iso-duration.md) writes an ISO 8601 duration.
