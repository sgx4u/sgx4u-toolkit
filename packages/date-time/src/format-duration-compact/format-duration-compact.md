# `formatDurationCompact`

Formats a duration with compact unit symbols such as `1h 30m`.

## Import

```ts
import { formatDurationCompact } from "@sgx4u/date-time";
```

## Signature

```ts
function formatDurationCompact(
    params: FormatDurationCompactParams,
): string | undefined;
```

## Parameters

| Name               | Type                 | Required | Default | Meaning                               |
| ------------------ | -------------------- | -------- | ------- | ------------------------------------- |
| `duration`         | `number \| Duration` | yes      |         | A duration or a millisecond count.    |
| `maximumUnitCount` | `number`             | no       | `2`     | The maximum number of non-zero units. |
| `separator`        | `string`             | no       | `" "`   | The text between units.               |

## Examples

```ts
formatDurationCompact({ duration: { hours: 1, minutes: 30 } });
// "1h 30m"

formatDurationCompact({ duration: 5_400_000 });
// "1h 30m"

formatDurationCompact({ duration: { days: 1, hours: 2, minutes: 3 } });
// "1d 2h"

formatDurationCompact({ duration: { days: 366, hours: 1 }, separator: ", " });
// "366d, 1h"
```

## Edge cases

Zero is `"0s"`. A negative duration keeps the sign on each unit, so `{ hours: -1, minutes: -30 }` is `"-1h -30m"`. `maximumUnitCount` below 1 throws `RangeError`. Mixed signs throw `RangeError`. A string throws `TypeError`. Years and months print as `y` and `mo`.

## Related

- [`formatDuration`](../format-duration/format-duration.md) writes localized unit names.
- [`formatISODuration`](../format-iso-duration/format-iso-duration.md) writes an ISO 8601 duration.
