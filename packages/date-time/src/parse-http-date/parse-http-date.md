# `parseHTTPDate`

Parses an HTTP date in IMF-fixdate, RFC 850, or asctime form.

## Import

```ts
import { parseHTTPDate } from "@sgx4u/date-time";
```

## Signature

```ts
function parseHTTPDate(value: string): Date | undefined;
```

## Parameters

| Name    | Type     | Required | Default | Meaning             |
| ------- | -------- | -------- | ------- | ------------------- |
| `value` | `string` | yes      |         | The candidate text. |

## Examples

```ts
parseHTTPDate("Thu, 26 Nov 2026 22:00:00 GMT")?.toISOString();
// "2026-11-26T22:00:00.000Z"

parseHTTPDate("Thursday, 01-Jan-70 00:00:00 GMT")?.toISOString();
// "1970-01-01T00:00:00.000Z"

parseHTTPDate("Thu Nov  5 00:00:00 2026")?.toISOString();
// "2026-11-05T00:00:00.000Z"

parseHTTPDate("not a date");
// undefined
```

## Edge cases

Text that does not match returns `undefined`. The weekday must agree with the calendar day, the clock must be a real time, and IMF-fixdate requires `GMT`. A two-digit RFC 850 year is placed in the century nearest the current time. A value that is not a string throws `TypeError`. Every accepted form is GMT.

## Related

- [`formatHTTPDate`](../format-http-date/format-http-date.md) writes an IMF-fixdate in GMT.
- [`parseRFC2822Date`](../parse-rfc2822-date/parse-rfc2822-date.md) reads an email date header.
