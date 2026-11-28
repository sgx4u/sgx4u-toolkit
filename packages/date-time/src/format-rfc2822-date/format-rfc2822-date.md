# `formatRFC2822Date`

Formats a date as an RFC 2822 date with a numeric offset.

## Import

```ts
import { formatRFC2822Date } from "@sgx4u/date-time";
```

## Signature

```ts
function formatRFC2822Date(params: FormatRFC2822DateParams): string | undefined;
```

## Parameters

| Name       | Type        | Required | Default                                  | Meaning                                            |
| ---------- | ----------- | -------- | ---------------------------------------- | -------------------------------------------------- |
| `date`     | `DateInput` | yes      |                                          | The instant to format.                             |
| `timeZone` | `string`    | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset |

## Examples

```ts
formatRFC2822Date({
    date: "2026-11-25T22:00:00.000Z",
    timeZone: "Asia/Kolkata",
});
// "Thu, 26 Nov 2026 03:30:00 +0530"

formatRFC2822Date({
    date: "2026-07-01T16:00:00Z",
    timeZone: "America/New_York",
});
// "Wed, 01 Jul 2026 12:00:00 -0400"

formatRFC2822Date({
    date: "2026-01-15T17:00:00Z",
    timeZone: "America/New_York",
});
// "Thu, 15 Jan 2026 12:00:00 -0500"

formatRFC2822Date({ date: "2024-02-29T23:59:59Z", timeZone: "UTC" });
// "Thu, 29 Feb 2024 23:59:59 +0000"
```

## Edge cases

The offset follows the zone at that instant, so New York is `-0400` in July and `-0500` in January. A date that is not usable returns `undefined`. An unusable zone throws `RangeError`.

## Related

- [`parseRFC2822Date`](../parse-rfc2822-date/parse-rfc2822-date.md) reads an RFC 2822 date.
- [`formatHTTPDate`](../format-http-date/format-http-date.md) writes the same instant in GMT.
