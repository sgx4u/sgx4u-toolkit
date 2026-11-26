# `formatISODateTime`

Formats an instant as an ISO date-time with a numeric offset.

## Import

```ts
import { formatISODateTime } from "@sgx4u/date-time";
```

## Signature

```ts
function formatISODateTime(
    date: DateInput,
    options?: FormatISODateTimeOptions,
): string;
```

## Options

| Name                  | Type                                    | Default         | Meaning                                  |
| --------------------- | --------------------------------------- | --------------- | ---------------------------------------- |
| `timeZone`            | `string`                                | System zone     | IANA name or fixed offset.               |
| `precision`           | `"minute" \| "second" \| "millisecond"` | `"millisecond"` | Smallest field written after the minute. |
| `includeTimeZoneName` | `boolean`                               | `false`         | Append `[zone]` for an IANA name.        |

## Examples

```ts
formatISODateTime("2024-02-29T00:00:00.000Z", { timeZone: "UTC" });
// "2024-02-29T00:00:00.000Z"

formatISODateTime("2026-11-25T22:00:00.000Z", {
    timeZone: "Asia/Kolkata",
    precision: "minute",
});
// "2026-11-26T03:30+05:30"

formatISODateTime("2024-02-28T18:30:00.000Z", { timeZone: "Asia/Kolkata" });
// "2024-02-29T00:00:00.000+05:30"

formatISODateTime("2024-03-10T06:30:00.000Z", {
    timeZone: "America/New_York",
    precision: "minute",
});
// "2024-03-10T01:30-05:00"
```

## Edge cases

The offset is `Z` only when `timeZone` is `"UTC"`. A fixed offset is written as `±HH:mm`. `includeTimeZoneName` appends `[zone]` for an IANA name, including `[UTC]`. An unknown `precision` throws `RangeError`. A date that is not usable returns `undefined`. On the New York spring-forward morning, `2024-03-10T06:30:00.000Z` is still `01:30-05:00`.

## Related

- [`formatISODate`](../format-iso-date/format-iso-date.md) writes only the calendar date.
- [`parseISODateTime`](../parse-iso-date-time/parse-iso-date-time.md) reads an ISO date-time.
