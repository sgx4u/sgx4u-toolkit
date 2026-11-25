# `toDate`

Returns a new `Date`. A date-only string is midnight in the given time zone, not UTC.

## Import

```ts
import { toDate } from "@sgx4u/date-time";
```

## Signature

```ts
function toDate(value: DateInput, options?: TimeZoneOptions): Date;
```

## Options

| Name       | Type     | Default     | Meaning                                                    |
| ---------- | -------- | ----------- | ---------------------------------------------------------- |
| `timeZone` | `string` | System zone | IANA name or fixed offset. Used for a `YYYY-MM-DD` string. |

## Examples

```ts
toDate("2026-11-26", { timeZone: "Asia/Kolkata" }).toISOString();
// "2026-11-25T18:30:00.000Z"

toDate("2024-02-29T00:00:00+0530").toISOString();
// "2024-02-28T18:30:00.000Z"

toDate(0).toISOString();
// "1970-01-01T00:00:00.000Z"
```

## Edge cases

The input `Date` is not mutated, and the result is a different object. `"2024-02-30"`, `Invalid Date`, and `NaN` throw `RangeError`. A boolean throws `TypeError`. In `America/Santiago`, `2024-09-08` has no midnight; the result is 01:00 after the daylight-saving gap.

## Related

- [`createDate`](../create-date/create-date.md) builds an instant from fields.
- [`isValidDate`](../is-valid-date/is-valid-date.md) checks a value without throwing.
