# `formatUTCOffset`

Formats a UTC offset in minutes.

## Import

```ts
import { formatUTCOffset } from "@sgx4u/date-time";
```

## Signature

```ts
function formatUTCOffset(params: FormatUTCOffsetParams): string | undefined;
```

## Parameters

| Name            | Type                               | Required | Default      | Meaning                                                                       |
| --------------- | ---------------------------------- | -------- | ------------ | ----------------------------------------------------------------------------- |
| `offsetMinutes` | `number`                           | yes      |              | Minutes east of UTC. A fraction is kept in the minutes.                       |
| `style`         | `"short" \| "extended" \| "basic"` | no       | `"extended"` | `extended` is `+05:30`, `basic` is `+0530`, and `short` drops a leading zero. |
| `useZForZero`   | `boolean`                          | no       | `false`      | Whether a zero offset is `Z`.                                                 |

## Examples

```ts
formatUTCOffset({ offsetMinutes: 330 });
// "+05:30"

formatUTCOffset({ offsetMinutes: 0 });
// "+00:00"

formatUTCOffset({ offsetMinutes: 0, useZForZero: true });
// "Z"

formatUTCOffset({ offsetMinutes: -90, style: "short" });
// "-1:30"
```

## Edge cases

A fraction is rounded in the minutes: `-332.4` is `"-05:32"`. `basic` writes `330` as `"+0530"`. `short` drops a zero minute part, so `300` is `"+5"` and `-300` is `"-5"`. A non-number throws `TypeError`. `NaN` throws `RangeError`. An unknown `style` throws `RangeError`.

## Related

- [`parseUTCOffset`](../parse-utc-offset/parse-utc-offset.md) reads offset text into minutes.
- [`getUTCOffset`](../get-utc-offset/get-utc-offset.md) returns the offset of a zone at an instant.
- [`formatTimeZoneName`](../format-time-zone-name/format-time-zone-name.md) returns the localized zone name.
