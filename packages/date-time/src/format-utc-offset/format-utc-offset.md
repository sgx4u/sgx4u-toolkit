# `formatUTCOffset`

Formats a UTC offset in minutes.

## Import

```ts
import { formatUTCOffset } from "@sgx4u/date-time";
```

## Signature

```ts
function formatUTCOffset(
    offsetMinutes: number,
    options?: FormatUTCOffsetOptions,
): string;
```

## Options

| Name          | Type                               | Default      | Meaning                                                                       |
| ------------- | ---------------------------------- | ------------ | ----------------------------------------------------------------------------- |
| `style`       | `"extended" \| "basic" \| "short"` | `"extended"` | `extended` is `+05:30`, `basic` is `+0530`, and `short` drops a leading zero. |
| `useZForZero` | `boolean`                          | `false`      | Whether a zero offset is `Z`.                                                 |

## Examples

```ts
formatUTCOffset(330);
// "+05:30"

formatUTCOffset(0);
// "+00:00"

formatUTCOffset(0, { useZForZero: true });
// "Z"

formatUTCOffset(-90, { style: "short" });
// "-1:30"
```

## Edge cases

A fraction is rounded in the minutes: `-332.4` is `"-05:32"`. `basic` writes `330` as `"+0530"`. `short` drops a zero minute part, so `300` is `"+5"` and `-300` is `"-5"`. A non-number throws `TypeError`. `NaN` throws `RangeError`. An unknown `style` throws `RangeError`.

## Related

- [`parseUTCOffset`](../parse-utc-offset/parse-utc-offset.md) reads offset text into minutes.
- [`getUTCOffset`](../get-utc-offset/get-utc-offset.md) returns the offset of a zone at an instant.
- [`formatTimeZoneName`](../format-time-zone-name/format-time-zone-name.md) returns the localized zone name.
