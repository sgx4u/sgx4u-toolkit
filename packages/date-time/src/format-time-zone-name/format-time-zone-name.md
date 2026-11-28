# `formatTimeZoneName`

Returns the localized name of a time zone at an instant.

## Import

```ts
import { formatTimeZoneName } from "@sgx4u/date-time";
```

## Signature

```ts
function formatTimeZoneName(
    params: FormatTimeZoneNameParams,
): string | undefined;
```

## Parameters

| Name       | Type                                                                                    | Required | Default                       | Meaning                                                                       |
| ---------- | --------------------------------------------------------------------------------------- | -------- | ----------------------------- | ----------------------------------------------------------------------------- |
| `timeZone` | `string`                                                                                | yes      |                               | An IANA name or a fixed offset.                                               |
| `style`    | `"long" \| "short" \| "shortOffset" \| "longOffset" \| "shortGeneric" \| "longGeneric"` | no       | `"long"`                      | The `Intl` time zone name style.                                              |
| `at`       | `DateInput`                                                                             | no       | The current time.             | The instant at which the name is read. Names can change with daylight saving. |
| `locale`   | `string \| readonly string[]`                                                           | no       | The runtime's default locale. | A BCP 47 language tag, or a list of tags in preference order.                 |

## Examples

```ts
formatTimeZoneName({
    timeZone: "Asia/Kolkata",
    locale: "en-US",
    at: "2026-01-01T00:00:00Z",
});
// "India Standard Time"

formatTimeZoneName({
    timeZone: "Asia/Kolkata",
    locale: "en-US",
    style: "longOffset",
    at: "2026-01-01T00:00:00Z",
});
// "GMT+05:30"

formatTimeZoneName({
    timeZone: "America/New_York",
    locale: "en-US",
    at: "2026-01-15T17:00:00Z",
});
// "Eastern Standard Time"
```

## Edge cases

Names can change with daylight saving, so `at` selects which name is read. An unknown zone or style throws `RangeError`. An invalid `at` throws `RangeError`.

## Related

- [`formatUTCOffset`](../format-utc-offset/format-utc-offset.md) writes the offset in minutes as text.
- [`getUTCOffset`](../get-utc-offset/get-utc-offset.md) returns the offset in minutes.
- [`listTimeZones`](../list-time-zones/list-time-zones.md) lists IANA time zone names.
