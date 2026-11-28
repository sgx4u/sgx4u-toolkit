# `parseLocaleDate`

Parses a numeric date written the way the locale writes it.

## Import

```ts
import { parseLocaleDate } from "@sgx4u/date-time";
```

## Signature

```ts
function parseLocaleDate(params: ParseLocaleDateParams): Date | undefined;
```

## Parameters

| Name       | Type                          | Required | Default                                  | Meaning                                                       |
| ---------- | ----------------------------- | -------- | ---------------------------------------- | ------------------------------------------------------------- |
| `value`    | `string`                      | yes      |                                          | The candidate text.                                           |
| `timeZone` | `string`                      | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset            |
| `locale`   | `string \| readonly string[]` | no       | The runtime's default locale.            | A BCP 47 language tag, or a list of tags in preference order. |

## Examples

```ts
parseLocaleDate({
    value: "11/26/2026",
    locale: "en-US",
    timeZone: "UTC",
})?.toISOString();
// "2026-11-26T00:00:00.000Z"

parseLocaleDate({
    value: "26/11/2026",
    locale: "en-GB",
    timeZone: "UTC",
})?.toISOString();
// "2026-11-26T00:00:00.000Z"

parseLocaleDate({
    value: "11/26/2026",
    locale: "en-US",
    timeZone: "Asia/Kolkata",
})?.toISOString();
// "2026-11-25T18:30:00.000Z"

parseLocaleDate({ value: "02/30/2026", locale: "en-US", timeZone: "UTC" });
// undefined
```

## Edge cases

Text that does not match the locale's numeric pattern returns `undefined`. Separators may be `/`, `.`, `-`, or a space. Day and month may be one or two digits. The year must be `1000` through `9999`. An impossible day, such as February 30, returns `undefined`. A value that is not a string throws `TypeError`.

The result is midnight in `timeZone`, using compatible disambiguation. A daylight-saving gap that skips midnight moves forward to the first instant that exists. In `America/Santiago`, September 8, 2024 is `2024-09-08T04:00:00.000Z`. A repeated midnight keeps the earlier instant.

## Related

- [`getLocaleDatePattern`](../get-locale-date-pattern/get-locale-date-pattern.md) returns the pattern this parser follows.
- [`parseDateWithPattern`](../parse-date-with-pattern/parse-date-with-pattern.md) parses an explicit pattern.
- [`parseISODate`](../parse-iso-date/parse-iso-date.md) parses `YYYY-MM-DD`.
