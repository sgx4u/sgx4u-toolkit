# `createDate`

Builds the instant for wall-clock fields in a time zone.

## Import

```ts
import { createDate } from "@sgx4u/date-time";
```

## Signature

```ts
function createDate(
    parts: DatePartsInput,
    options?: TimeZoneOptions & DisambiguationOptions,
): Date;
```

## Options

| Name             | Type                                               | Default        | Meaning                                  |
| ---------------- | -------------------------------------------------- | -------------- | ---------------------------------------- |
| `timeZone`       | `string`                                           | System zone    | IANA name or fixed offset.               |
| `disambiguation` | `"compatible" \| "earlier" \| "later" \| "reject"` | `"compatible"` | How to treat a skipped or repeated time. |

Omitted fields of `parts` default to month `1`, day `1`, and time `0`.

## Examples

```ts
createDate(
    { year: 2026, month: 11, day: 26, hour: 9 },
    { timeZone: "Asia/Kolkata" },
).toISOString();
// "2026-11-26T03:30:00.000Z"
```

## Edge cases

February 30 throws `RangeError`. In `America/New_York`, `2024-03-10` 02:30 does not exist. `"compatible"` returns 03:30 EDT (`2024-03-10T07:30:00.000Z`). `"earlier"` returns 01:30 EST. `"reject"` throws. On `2024-11-03`, 01:30 happens twice; `"compatible"` keeps the earlier instant.

## Related

- [`getDateParts`](../get-date-parts/get-date-parts.md) reads the fields back.
- [`toDate`](../to-date/to-date.md) accepts a string or timestamp.
