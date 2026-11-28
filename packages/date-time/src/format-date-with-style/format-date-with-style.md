# `formatDateWithStyle`

Formats a date with `Intl` date and time styles.

## Import

```ts
import { formatDateWithStyle } from "@sgx4u/date-time";
```

## Signature

```ts
function formatDateWithStyle(
    params: FormatDateWithStyleParams,
): string | undefined;
```

## Parameters

| Name              | Type                                      | Required | Default                                  | Meaning                                                       |
| ----------------- | ----------------------------------------- | -------- | ---------------------------------------- | ------------------------------------------------------------- |
| `date`            | `DateInput`                               | yes      |                                          | The instant to format.                                        |
| `dateStyle`       | `"long" \| "short" \| "medium" \| "full"` | no       | `"medium"`                               | The date length. Used alone when `timeStyle` is omitted.      |
| `timeStyle`       | `"long" \| "short" \| "medium" \| "full"` | no       |                                          | The time length. Omit it to format the date only.             |
| `calendar`        | `string`                                  | no       |                                          | An `Intl` calendar name, such as `"gregory"`.                 |
| `numberingSystem` | `string`                                  | no       |                                          | An `Intl` numbering system.                                   |
| `hourCycle`       | `"h11" \| "h12" \| "h23" \| "h24"`        | no       |                                          | The hour cycle passed to `Intl`.                              |
| `timeZone`        | `string`                                  | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset            |
| `locale`          | `string \| readonly string[]`             | no       | The runtime's default locale.            | A BCP 47 language tag, or a list of tags in preference order. |

## Examples

```ts
formatDateWithStyle({
    date: "2026-11-26T00:00:00Z",
    timeZone: "UTC",
    locale: "en-US",
});
// "Nov 26, 2026"

formatDateWithStyle({
    date: "2024-12-31T22:00:00Z",
    timeZone: "Asia/Kolkata",
    locale: "en-US",
});
// "Jan 1, 2025"

formatDateWithStyle({
    date: "2024-03-10T06:30:00Z",
    timeZone: "America/New_York",
    locale: "en-US",
    timeStyle: "short",
});
// "1:30 AM"
```

## Edge cases

When only `timeStyle` is set, the date is omitted. A date that is not usable returns `undefined`. An unusable zone throws `RangeError`. `2024-02-29T00:00:00Z` in UTC with `en-US` and a medium date is `"Feb 29, 2024"`.

## Related

- [`formatDate`](../format-date/format-date.md) formats one instant with a token pattern.
- [`formatDateRange`](../format-date-range/format-date-range.md) formats two instants with the same styles.
