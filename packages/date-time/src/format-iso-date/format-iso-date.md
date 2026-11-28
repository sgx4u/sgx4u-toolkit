# `formatISODate`

Formats the calendar date in a time zone as `YYYY-MM-DD`.

## Import

```ts
import { formatISODate } from "@sgx4u/date-time";
```

## Signature

```ts
function formatISODate(params: FormatISODateParams): string | undefined;
```

## Parameters

| Name       | Type        | Required | Default                                  | Meaning                                            |
| ---------- | ----------- | -------- | ---------------------------------------- | -------------------------------------------------- |
| `date`     | `DateInput` | yes      |                                          | The instant to format.                             |
| `timeZone` | `string`    | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset |

## Examples

```ts
formatISODate({
    date: "2026-11-25T22:00:00Z",
    timeZone: "Asia/Kolkata",
});
// "2026-11-26"

formatISODate({
    date: "2024-02-29T00:00:00Z",
    timeZone: "UTC",
});
// "2024-02-29"
```

## Edge cases

The date is the wall-clock date in the zone. `2026-11-25T22:00:00Z` is still 25 November in UTC and is 26 November in `Asia/Kolkata`. A date that is not usable returns `undefined`. An unusable `timeZone` throws `RangeError`.

## Related

- [`formatISODateTime`](../format-iso-date-time/format-iso-date-time.md) writes the date, time, and offset.
- [`parseISODate`](../parse-iso-date/parse-iso-date.md) reads a `YYYY-MM-DD` string.
