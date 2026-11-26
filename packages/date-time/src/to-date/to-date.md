# `toDate`

Returns a new `Date` for a date, a timestamp, or a date string.

## Import

```ts
import { toDate } from "@sgx4u/date-time";
```

## Signature

```ts
function toDate(value: DateInput, options?: TimeZoneOptions): Date;
```

## Options

| Name       | Type     | Default     | Meaning                                          |
| ---------- | -------- | ----------- | ------------------------------------------------ |
| `timeZone` | `string` | System zone | Zone used when `value` is a `YYYY-MM-DD` string. |

## Examples

```ts
toDate("2026-11-26", { timeZone: "Asia/Kolkata" }).toISOString();
// "2026-11-25T18:30:00.000Z"

toDate("2026-11-26", { timeZone: "UTC" }).toISOString();
// "2026-11-26T00:00:00.000Z"

toDate("2024-02-29T00:00:00+0530").toISOString();
// "2024-02-28T18:30:00.000Z"

toDate("2024-09-08", { timeZone: "America/Santiago" }).toISOString();
// "2024-09-08T04:00:00.000Z"
```

## Edge cases

A `Date` or a millisecond timestamp is that instant, and the result is a new object. A date-time string with an offset is that exact instant. `timeZone` applies to a `YYYY-MM-DD` string, which is midnight in that zone. An invalid date throws `RangeError`. A value of another type throws `TypeError`. An unusable `timeZone` throws `RangeError`.

A date-only midnight uses compatible disambiguation. A daylight-saving gap that skips midnight moves forward to the first instant that exists, which is why `2024-09-08` in `America/Santiago` is `2024-09-08T04:00:00.000Z`. A repeated midnight keeps the earlier instant.

## Related

- [`parseISODate`](../parse-iso-date/parse-iso-date.md) parses `YYYY-MM-DD` and returns `undefined` for invalid text.
- [`isValidDate`](../is-valid-date/is-valid-date.md) reports whether a value is a real date.
- [`getDateParts`](../get-date-parts/get-date-parts.md) reads the wall-clock fields of the result.
