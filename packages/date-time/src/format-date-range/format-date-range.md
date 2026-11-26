# `formatDateRange`

Formats two dates as a localized range and collapses shared parts.

## Import

```ts
import { formatDateRange } from "@sgx4u/date-time";
```

## Signature

```ts
function formatDateRange(
    start: DateInput,
    end: DateInput,
    options?: FormatDateWithStyleOptions,
): string;
```

## Options

| Name              | Type                                      | Default        | Meaning                                        |
| ----------------- | ----------------------------------------- | -------------- | ---------------------------------------------- |
| `timeZone`        | `string`                                  | System zone    | IANA name or fixed offset.                     |
| `locale`          | `string \| readonly string[]`             | Runtime locale | Locale for the range text.                     |
| `dateStyle`       | `"full" \| "long" \| "medium" \| "short"` | `"medium"`     | Date length. Used when `timeStyle` is omitted. |
| `timeStyle`       | `"full" \| "long" \| "medium" \| "short"` |                | Time length. Omit it to format the date only.  |
| `calendar`        | `string`                                  |                | `Intl` calendar name, such as `"gregory"`.     |
| `numberingSystem` | `string`                                  |                | `Intl` numbering system.                       |
| `hourCycle`       | `"h11" \| "h12" \| "h23" \| "h24"`        |                | Hour cycle passed to `Intl`.                   |

## Examples

```ts
formatDateRange("2026-01-03T00:00:00Z", "2026-01-05T00:00:00Z", {
    timeZone: "UTC",
    locale: "en-US",
});
// "Jan 3\u2009\u2013\u20095, 2026"

formatDateRange("2024-02-29T00:00:00Z", "2024-03-01T00:00:00Z", {
    timeZone: "UTC",
    locale: "en-US",
});
// "Feb 29\u2009\u2013\u2009Mar 1, 2024"

formatDateRange("2024-12-31T00:00:00Z", "2025-01-01T00:00:00Z", {
    timeZone: "UTC",
    locale: "en-US",
});
// "Dec 31, 2024\u2009\u2013\u2009Jan 1, 2025"
```

## Edge cases

`start` after `end` throws `RangeError`. A date that is not usable returns `undefined`. The separator in `en-US` is a narrow no-break space, an en dash, and a narrow no-break space. A range that stays in one month drops the repeated month. A range that crosses a year keeps both years. In `America/New_York`, `2024-03-10T05:00:00Z` through `2024-03-11T04:00:00Z` is `Mar 10\u2009\u2013\u200911, 2024`.

## Related

- [`formatDateWithStyle`](../format-date-with-style/format-date-with-style.md) formats one instant with the same styles.
- [`formatDate`](../format-date/format-date.md) formats one instant with a token pattern.
