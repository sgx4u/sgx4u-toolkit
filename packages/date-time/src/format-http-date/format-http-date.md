# `formatHttpDate`

Formats a date as an HTTP IMF-fixdate in GMT.

## Import

```ts
import { formatHttpDate } from "@sgx4u/date-time";
```

## Signature

```ts
function formatHttpDate(date: DateInput): string;
```

## Options

This function has no options.

## Examples

```ts
formatHttpDate("2026-11-26T22:00:00.000Z");
// "Thu, 26 Nov 2026 22:00:00 GMT"

formatHttpDate("2024-02-29T00:00:00.000Z");
// "Thu, 29 Feb 2024 00:00:00 GMT"

formatHttpDate("2024-02-29T23:59:59.999Z");
// "Thu, 29 Feb 2024 23:59:59 GMT"

formatHttpDate("2025-01-01T00:00:00.000Z");
// "Wed, 01 Jan 2025 00:00:00 GMT"
```

## Edge cases

The text is always GMT. Milliseconds are truncated, so `23:59:59.999` stays on that second. A value that is not a real date throws `RangeError`, including `"nope"` and an invalid `Date`.

## Related

- [`parseHttpDate`](../parse-http-date/parse-http-date.md) reads an HTTP date.
- [`formatRfc2822Date`](../format-rfc2822-date/format-rfc2822-date.md) writes a date with a numeric offset.
