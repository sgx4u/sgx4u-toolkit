# `setDateParts`

Returns a date with some wall-clock fields replaced.

## Import

```ts
import { setDateParts } from "@sgx4u/date-time";
```

## Signature

```ts
function setDateParts(
    date: DateInput,
    parts: Partial<DatePartsInput>,
    options?: AddDurationOptions,
): Date;
```

## Options

| Name             | Type                                               | Default        | Meaning                                                       |
| ---------------- | -------------------------------------------------- | -------------- | ------------------------------------------------------------- |
| `timeZone`       | `string`                                           | System zone    | Zone the wall-clock fields are read and written in.           |
| `disambiguation` | `"compatible" \| "earlier" \| "later" \| "reject"` | `"compatible"` | How a skipped or repeated wall time is chosen.                |
| `overflow`       | `"constrain" \| "reject"`                          | `"constrain"`  | Clamps a missing day, or throws when that day does not exist. |

## Examples

```ts
setDateParts(
    "2026-01-15T00:00:00Z",
    { day: 31 },
    { timeZone: "UTC" },
).toISOString();
// "2026-01-31T00:00:00.000Z"

setDateParts(
    "2026-01-31T00:00:00Z",
    { month: 2 },
    { timeZone: "UTC" },
).toISOString();
// "2026-02-28T00:00:00.000Z"

setDateParts(
    "2024-03-10T06:30:00Z",
    { hour: 2, minute: 30 },
    { timeZone: "America/New_York" },
).toISOString();
// "2024-03-10T07:30:00.000Z"
```

## Edge cases

Omitted fields stay as they are in `timeZone`. A day that does not exist is clamped to the last real day when `overflow` is `"constrain"`. `"reject"` throws `RangeError` for that day. A field outside its range throws `RangeError`. A value of the wrong type throws `TypeError`.

`"compatible"` moves a skipped wall time forward by the gap and keeps the earlier instant of a repeated time. On 2024-03-10 in `America/New_York`, hour `2` and minute `30` do not exist, so the result is 3:30 local, `2024-03-10T07:30:00.000Z`. `"reject"` throws on that gap. On the 2024-11-03 overlap, `"later"` selects the second 1:30, `2024-11-03T06:30:00.000Z`.

## Related

- [`getDateParts`](../get-date-parts/get-date-parts.md) reads the wall-clock fields this function replaces.
- [`createDate`](../create-date/create-date.md) builds an instant from a full set of fields.
- [`addDuration`](../add-duration/add-duration.md) uses the same overflow and disambiguation options.
