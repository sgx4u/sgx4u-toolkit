# `getDateParts`

Returns the year, month, day, time, ISO weekday, and UTC offset of an instant in a time zone.

## Import

```ts
import { getDateParts } from "@sgx4u/date-time";
```

## Signature

```ts
function getDateParts(date: DateInput, options?: TimeZoneOptions): DateParts;
```

## Options

| Name       | Type     | Default     | Meaning                    |
| ---------- | -------- | ----------- | -------------------------- |
| `timeZone` | `string` | System zone | IANA name or fixed offset. |

Months are `1`–`12`. Weekdays are `1` (Monday) through `7` (Sunday).

## Examples

```ts
getDateParts("2024-06-15T16:00:00.123Z", { timeZone: "America/New_York" });
// { year: 2024, month: 6, day: 15, hour: 12, minute: 0, second: 0,
//   millisecond: 123, weekday: 6, offsetMinutes: -240 }
```

## Edge cases

A date-only string is midnight in the zone. Historical offsets may be fractional minutes. The input is not mutated.

## Related

- [`createDate`](../create-date/create-date.md) builds an instant from these fields.
- [`getUtcOffset`](../get-utc-offset/get-utc-offset.md) returns only the offset.
