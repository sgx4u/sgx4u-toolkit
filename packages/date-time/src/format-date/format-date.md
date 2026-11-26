# `formatDate`

Formats a date with Unicode CLDR field tokens such as `yyyy-MM-dd HH:mm`.

## Import

```ts
import { formatDate } from "@sgx4u/date-time";
```

## Signature

```ts
function formatDate(params: FormatDateParams): string | undefined;
```

## Parameters

| Name       | Type                          | Required | Default                                  | Meaning                                                       |
| ---------- | ----------------------------- | -------- | ---------------------------------------- | ------------------------------------------------------------- |
| `date`     | `DateInput`                   | yes      |                                          | The instant to format.                                        |
| `pattern`  | `string`                      | yes      |                                          | A pattern such as `yyyy-MM-dd HH:mm`.                         |
| `timeZone` | `string`                      | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset            |
| `locale`   | `string \| readonly string[]` | no       | The runtime's default locale.            | A BCP 47 language tag, or a list of tags in preference order. |

## Examples

```ts
formatDate({
    date: "2026-11-25T22:00:00.000Z",
    pattern: "yyyy-MM-dd HH:mm",
    timeZone: "Asia/Kolkata",
});
// "2026-11-26 03:30"

formatDate({
    date: "2026-11-26T00:00:00Z",
    pattern: "MMMM",
    timeZone: "UTC",
    locale: "en-US",
});
// "November"

formatDate({
    date: "2026-11-26T03:30:00.000Z",
    pattern: "'Q'QQ yyyy",
    timeZone: "UTC",
});
// "Q04 2026"

formatDate({
    date: "2026-11-26T00:00:00.000Z",
    pattern: "XXX",
    timeZone: "UTC",
});
// "Z"
```

## Edge cases

Quoted text is literal and `''` is one quote. An unsupported ASCII letter run throws `RangeError`. `XXX` is `Z` when the offset is zero. Month and weekday names come from `Intl`. Numeric fields use Latin digits. A date that is not usable returns `undefined`.

## Related

- [`formatISODate`](../format-iso-date/format-iso-date.md) writes `YYYY-MM-DD` in the zone.
- [`formatDateWithStyle`](../format-date-with-style/format-date-with-style.md) uses `Intl` date and time styles.
- [`getDateParts`](../get-date-parts/get-date-parts.md) reads the fields the pattern uses.
