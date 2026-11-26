# `formatDurationCompact`

Formats a duration with compact unit symbols such as `1h 30m`.

## Import

```ts
import { formatDurationCompact } from "@sgx4u/date-time";
```

## Signature

```ts
function formatDurationCompact(
    duration: Duration | number,
    options?: FormatDurationCompactOptions,
): string;
```

## Options

| Name               | Type     | Default | Meaning                           |
| ------------------ | -------- | ------- | --------------------------------- |
| `maximumUnitCount` | `number` | `2`     | Maximum number of non-zero units. |
| `separator`        | `string` | `" "`   | Text between units.               |

## Examples

```ts
formatDurationCompact({ hours: 1, minutes: 30 });
// "1h 30m"

formatDurationCompact(5_400_000);
// "1h 30m"

formatDurationCompact({ days: 1, hours: 2, minutes: 3 });
// "1d 2h"

formatDurationCompact({ days: 366, hours: 1 }, { separator: ", " });
// "366d, 1h"
```

## Edge cases

Zero is `"0s"`. A negative duration keeps the sign on each unit, so `{ hours: -1, minutes: -30 }` is `"-1h -30m"`. `maximumUnitCount` below 1 throws `RangeError`. Mixed signs throw `RangeError`. A string throws `TypeError`. Years and months print as `y` and `mo`.

## Related

- [`formatDuration`](../format-duration/format-duration.md) writes localized unit names.
- [`formatIsoDuration`](../format-iso-duration/format-iso-duration.md) writes an ISO 8601 duration.
