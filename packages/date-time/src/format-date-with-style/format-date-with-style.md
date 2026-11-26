# `formatDateWithStyle`

Formats a date with `Intl` date and time styles.

## Import

```ts
import { formatDateWithStyle } from "@sgx4u/date-time";
```

## Signature

```ts
function formatDateWithStyle(
    date: DateInput,
    options?: FormatDateWithStyleOptions,
): string;
```

## Options

| Name              | Type                                      | Default        | Meaning                                        |
| ----------------- | ----------------------------------------- | -------------- | ---------------------------------------------- |
| `timeZone`        | `string`                                  | System zone    | IANA name or fixed offset.                     |
| `locale`          | `string \| readonly string[]`             | Runtime locale | Locale for the text.                           |
| `dateStyle`       | `"full" \| "long" \| "medium" \| "short"` | `"medium"`     | Date length. Used when `timeStyle` is omitted. |
| `timeStyle`       | `"full" \| "long" \| "medium" \| "short"` |                | Time length. Omit it to format the date only.  |
| `calendar`        | `string`                                  |                | `Intl` calendar name, such as `"gregory"`.     |
| `numberingSystem` | `string`                                  |                | `Intl` numbering system.                       |
| `hourCycle`       | `"h11" \| "h12" \| "h23" \| "h24"`        |                | Hour cycle passed to `Intl`.                   |

## Examples

```ts
formatDateWithStyle("2026-11-26T00:00:00Z", {
    timeZone: "UTC",
    locale: "en-US",
});
// "Nov 26, 2026"

formatDateWithStyle("2024-12-31T22:00:00Z", {
    timeZone: "Asia/Kolkata",
    locale: "en-US",
});
// "Jan 1, 2025"

formatDateWithStyle("2024-03-10T06:30:00Z", {
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
