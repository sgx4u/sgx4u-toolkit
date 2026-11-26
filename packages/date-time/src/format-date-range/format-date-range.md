# `formatDateRange`

Formats two dates as a localized range and collapses shared parts.

## Import

```ts
import { formatDateRange } from "@sgx4u/date-time";
```

## Signature

```ts
function formatDateRange(params: FormatDateRangeParams): string | undefined;
```

## Parameters

| Name              | Type                                      | Required | Default                                  | Meaning                                                       |
| ----------------- | ----------------------------------------- | -------- | ---------------------------------------- | ------------------------------------------------------------- |
| `start`           | `DateInput`                               | yes      |                                          | The first instant.                                            |
| `end`             | `DateInput`                               | yes      |                                          | The second instant. It must not be before `start`.            |
| `dateStyle`       | `"long" \| "short" \| "medium" \| "full"` | no       | `"medium"`                               | The date length. Used alone when `timeStyle` is omitted.      |
| `timeStyle`       | `"long" \| "short" \| "medium" \| "full"` | no       |                                          | The time length. Omit it to format the date only.             |
| `calendar`        | `string`                                  | no       |                                          | An `Intl` calendar name, such as `"gregory"`.                 |
| `numberingSystem` | `string`                                  | no       |                                          | An `Intl` numbering system.                                   |
| `hourCycle`       | `"h11" \| "h12" \| "h23" \| "h24"`        | no       |                                          | The hour cycle passed to `Intl`.                              |
| `timeZone`        | `string`                                  | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset            |
| `locale`          | `string \| readonly string[]`             | no       | The runtime's default locale.            | A BCP 47 language tag, or a list of tags in preference order. |

## Examples

```ts
formatDateRange({
    start: "2026-01-03T00:00:00Z",
    end: "2026-01-05T00:00:00Z",
    timeZone: "UTC",
    locale: "en-US",
});
// "Jan 3\u2009\u2013\u20095, 2026"

formatDateRange({
    start: "2024-02-29T00:00:00Z",
    end: "2024-03-01T00:00:00Z",
    timeZone: "UTC",
    locale: "en-US",
});
// "Feb 29\u2009\u2013\u2009Mar 1, 2024"

formatDateRange({
    start: "2024-12-31T00:00:00Z",
    end: "2025-01-01T00:00:00Z",
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
