# `parseDateWithPattern`

Parses text written with the same tokens as `formatDate`.

## Import

```ts
import { parseDateWithPattern } from "@sgx4u/date-time";
```

## Signature

```ts
function parseDateWithPattern(
    params: ParseDateWithPatternParams,
): Date | undefined;
```

## Parameters

| Name             | Type                          | Required | Default                                  | Meaning                                                              |
| ---------------- | ----------------------------- | -------- | ---------------------------------------- | -------------------------------------------------------------------- |
| `value`          | `string`                      | yes      |                                          | The text to parse.                                                   |
| `pattern`        | `string`                      | yes      |                                          | The CLDR-style pattern.                                              |
| `referenceDate`  | `DateInput`                   | no       | The current time.                        | Fields missing from the pattern come from this instant. Omitted time |
| `timeZone`       | `string`                      | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset                   |
| `locale`         | `string \| readonly string[]` | no       | The runtime's default locale.            | A BCP 47 language tag, or a list of tags in preference order.        |
| `disambiguation` | `Disambiguation`              | no       | `"compatible"`                           | Which instant to use at a daylight-saving gap or overlap.            |

## Examples

```ts
parseDateWithPattern({
    value: "2026-11-26 03:30",
    pattern: "yyyy-MM-dd HH:mm",
    timeZone: "Asia/Kolkata",
})?.toISOString();
// "2026-11-25T22:00:00.000Z"

parseDateWithPattern({
    value: "November 26, 2026",
    pattern: "MMMM d, yyyy",
    timeZone: "UTC",
    locale: "en-US",
})?.toISOString();
// "2026-11-26T00:00:00.000Z"

parseDateWithPattern({
    value: "3:30 PM",
    pattern: "h:mm a",
    timeZone: "UTC",
    locale: "en-US",
    referenceDate: "2026-11-26T00:00:00Z",
})?.toISOString();
// "2026-11-26T15:30:00.000Z"

parseDateWithPattern({
    value: "2026-02-30",
    pattern: "yyyy-MM-dd",
    timeZone: "UTC",
});
// undefined
```

## Edge cases

Text that does not match the pattern returns `undefined`. A day that does not exist returns `undefined`. Numeric tokens match exactly. Month names, weekday names, eras, and AM/PM come from `Intl` for `locale`. Fields missing from the pattern come from `referenceDate`. When the pattern contains a date field, omitted time fields become zero. A value or pattern that is not a string throws `TypeError`. An unknown token throws `RangeError`.

`"compatible"` moves a skipped wall time forward by the gap and keeps the earlier instant of a repeated time. `2024-03-10 02:30` in `America/New_York` returns `2024-03-10T07:30:00.000Z`. `"reject"` on that gap returns `undefined`.

## Related

- [`formatDate`](../format-date/format-date.md) writes text with the same tokens.
- [`matchesDatePattern`](../matches-date-pattern/matches-date-pattern.md) reports whether text fits a pattern.
- [`parseLocaleDate`](../parse-locale-date/parse-locale-date.md) parses a locale's numeric date.
