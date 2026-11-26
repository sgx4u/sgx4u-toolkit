# `formatTimeZoneName`

Returns the localized name of a time zone at an instant.

## Import

```ts
import { formatTimeZoneName } from "@sgx4u/date-time";
```

## Signature

```ts
function formatTimeZoneName(
    timeZone: string,
    options?: FormatTimeZoneNameOptions,
): string;
```

## Options

| Name     | Type                                                                                    | Default        | Meaning                            |
| -------- | --------------------------------------------------------------------------------------- | -------------- | ---------------------------------- |
| `locale` | `string \| readonly string[]`                                                           | Runtime locale | Locale for the name.               |
| `style`  | `"long" \| "short" \| "shortOffset" \| "longOffset" \| "shortGeneric" \| "longGeneric"` | `"long"`       | `Intl` time zone name style.       |
| `at`     | `DateInput`                                                                             | Current time   | Instant at which the name is read. |

## Examples

```ts
formatTimeZoneName("Asia/Kolkata", {
    locale: "en-US",
    at: "2026-01-01T00:00:00Z",
});
// "India Standard Time"

formatTimeZoneName("Asia/Kolkata", {
    locale: "en-US",
    style: "longOffset",
    at: "2026-01-01T00:00:00Z",
});
// "GMT+05:30"

formatTimeZoneName("America/New_York", {
    locale: "en-US",
    at: "2026-01-15T17:00:00Z",
});
// "Eastern Standard Time"
```

## Edge cases

Names can change with daylight saving, so `at` selects which name is read. An unknown zone or style throws `RangeError`. An invalid `at` throws `RangeError`.

## Related

- [`formatUtcOffset`](../format-utc-offset/format-utc-offset.md) writes the offset in minutes as text.
- [`getUtcOffset`](../get-utc-offset/get-utc-offset.md) returns the offset in minutes.
- [`listTimeZones`](../list-time-zones/list-time-zones.md) lists IANA time zone names.
