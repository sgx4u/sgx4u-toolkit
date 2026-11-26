# `parseISODate`

Parses `YYYY-MM-DD` as midnight in a time zone.

## Import

```ts
import { parseISODate } from "@sgx4u/date-time";
```

## Signature

```ts
function parseISODate(
    value: string,
    options?: TimeZoneOptions,
): Date | undefined;
```

## Options

| Name       | Type     | Default     | Meaning                    |
| ---------- | -------- | ----------- | -------------------------- |
| `timeZone` | `string` | System zone | IANA name or fixed offset. |

## Examples

```ts
parseISODate("2026-11-26", { timeZone: "UTC" })?.toISOString();
// "2026-11-26T00:00:00.000Z"

parseISODate("2026-11-26", { timeZone: "Asia/Kolkata" })?.toISOString();
// "2026-11-25T18:30:00.000Z"

parseISODate("2024-07-15", { timeZone: "America/New_York" })?.toISOString();
// "2024-07-15T04:00:00.000Z"

parseISODate("2024-02-30", { timeZone: "UTC" });
// undefined
```

## Edge cases

Text that is not a real calendar date returns `undefined`, including February 30, a non-leap February 29, and a date-time string. A value that is not a string throws `TypeError`. An unusable `timeZone` throws `RangeError`.

Midnight uses compatible disambiguation. A daylight-saving gap that skips midnight moves forward to the first instant that exists. In `America/Santiago`, `2024-09-08` is `2024-09-08T04:00:00.000Z`. A repeated midnight keeps the earlier instant. Summer and winter offsets differ: `2024-01-15` in `America/New_York` is `2024-01-15T05:00:00.000Z`.

## Related

- [`formatISODate`](../format-iso-date/format-iso-date.md) writes `YYYY-MM-DD` in a zone.
- [`parseISODateTime`](../parse-iso-date-time/parse-iso-date-time.md) reads a date-time with an offset.
- [`toDate`](../to-date/to-date.md) accepts a date-only string or an instant.
