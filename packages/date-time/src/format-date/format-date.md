# `formatDate`

Formats a date with Unicode CLDR field tokens such as `yyyy-MM-dd HH:mm`.

## Import

```ts
import { formatDate } from "@sgx4u/date-time";
```

## Signature

```ts
function formatDate(
    date: DateInput,
    pattern: string,
    options?: TimeZoneOptions & LocaleOptions,
): string;
```

## Options

| Name       | Type                          | Default        | Meaning                    |
| ---------- | ----------------------------- | -------------- | -------------------------- |
| `timeZone` | `string`                      | System zone    | IANA name or fixed offset. |
| `locale`   | `string \| readonly string[]` | Runtime locale | Locale for names.          |

## Examples

```ts
formatDate("2026-11-25T22:00:00.000Z", "yyyy-MM-dd HH:mm", {
    timeZone: "Asia/Kolkata",
}); // "2026-11-26 03:30"

formatDate("2026-11-26T00:00:00Z", "MMMM", {
    timeZone: "UTC",
    locale: "en-US",
}); // "November"
```

## Edge cases

Quoted text is literal and `''` is one quote. An unsupported ASCII letter run throws `RangeError`. `XXX` is `Z` when the offset is zero. Month and weekday names come from `Intl`.

## Related

- [`formatIsoDate`](../format-iso-date/format-iso-date.md) writes `YYYY-MM-DD` in the zone.
- [`getDateParts`](../get-date-parts/get-date-parts.md) reads the fields the pattern uses.
