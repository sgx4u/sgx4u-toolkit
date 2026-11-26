# `formatIsoDate`

Formats the calendar date in a time zone as `YYYY-MM-DD`.

## Import

```ts
import { formatIsoDate } from "@sgx4u/date-time";
```

## Signature

```ts
function formatIsoDate(date: DateInput, options?: TimeZoneOptions): string;
```

## Options

| Name       | Type     | Default     | Meaning                    |
| ---------- | -------- | ----------- | -------------------------- |
| `timeZone` | `string` | System zone | IANA name or fixed offset. |

## Examples

```ts
formatIsoDate("2026-11-25T22:00:00Z", { timeZone: "Asia/Kolkata" });
// "2026-11-26"

formatIsoDate("2024-02-29T00:00:00Z", { timeZone: "UTC" });
// "2024-02-29"

formatIsoDate("2024-02-28T18:30:00Z", { timeZone: "Asia/Kolkata" });
// "2024-02-29"
```

## Edge cases

The date is the wall-clock date in the zone. `2026-11-25T22:00:00Z` is still 25 November in UTC and is 26 November in `Asia/Kolkata`. A date that does not parse throws `RangeError`. An unusable zone throws `RangeError`.

## Related

- [`formatIsoDateTime`](../format-iso-date-time/format-iso-date-time.md) writes the date, time, and offset.
- [`parseIsoDate`](../parse-iso-date/parse-iso-date.md) reads a `YYYY-MM-DD` string.
