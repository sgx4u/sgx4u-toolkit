# `parseRfc2822Date`

Parses an email date header.

## Import

```ts
import { parseRfc2822Date } from "@sgx4u/date-time";
```

## Signature

```ts
function parseRfc2822Date(value: string): Date | undefined;
```

## Options

This function has no options.

## Examples

```ts
parseRfc2822Date("Thu, 26 Nov 2026 03:30:00 +0530")?.toISOString();
// "2026-11-25T22:00:00.000Z"

parseRfc2822Date("26 Nov 2026 03:30 +0530")?.toISOString();
// "2026-11-25T22:00:00.000Z"

parseRfc2822Date("26 Nov 2026 12:00:00 EST")?.toISOString();
// "2026-11-26T17:00:00.000Z"

parseRfc2822Date("30 Feb 2024 00:00:00 GMT");
// undefined
```

## Edge cases

Text that does not match returns `undefined`, including an impossible day and an offset that is not a real clock offset. The weekday and the seconds may be omitted. Numeric offsets and the obsolete zone names (`EST`, `PDT`, `UT`, `GMT`) are accepted. A two-digit year from `00` through `49` is 2000 through 2049, and `50` through `99` is 1950 through 1999. A value that is not a string throws `TypeError`. The offset written in the text places the instant.

## Related

- [`formatRfc2822Date`](../format-rfc2822-date/format-rfc2822-date.md) writes an RFC 2822 date with a numeric offset.
- [`parseHttpDate`](../parse-http-date/parse-http-date.md) reads an HTTP date in GMT.
