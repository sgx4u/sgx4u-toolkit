# `setDateParts`

Returns a date with some wall-clock fields replaced.

## Import

```ts
import { setDateParts } from "@sgx4u/date-time";
```

## Signature

```ts
function setDateParts(params: SetDatePartsParams): Date | undefined;
```

## Parameters

| Name             | Type                      | Required | Default                                  | Meaning                                                        |
| ---------------- | ------------------------- | -------- | ---------------------------------------- | -------------------------------------------------------------- |
| `date`           | `DateInput`               | yes      |                                          | The starting instant.                                          |
| `parts`          | `Partial<DatePartsInput>` | yes      |                                          | The fields to replace.                                         |
| `overflow`       | `Overflow`                | no       | `"constrain"`                            | What to do when the day does not exist in the resulting month. |
| `timeZone`       | `string`                  | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset             |
| `disambiguation` | `Disambiguation`          | no       | `"compatible"`                           | Which instant to use at a daylight-saving gap or overlap.      |

## Examples

```ts
setDateParts({
    date: "2026-01-15T00:00:00Z",
    parts: { day: 31 },
    timeZone: "UTC",
}).toISOString();
// "2026-01-31T00:00:00.000Z"

setDateParts({
    date: "2026-01-31T00:00:00Z",
    parts: { month: 2 },
    timeZone: "UTC",
}).toISOString();
// "2026-02-28T00:00:00.000Z"

setDateParts({
    date: "2024-03-10T06:30:00Z",
    parts: { hour: 2, minute: 30 },
    timeZone: "America/New_York",
}).toISOString();
// "2024-03-10T07:30:00.000Z"
```

## Edge cases

Omitted fields stay as they are in `timeZone`. A day that does not exist is clamped to the last real day when `overflow` is `"constrain"`. `"reject"` throws `RangeError` for that day. A field outside its range throws `RangeError`. A value of the wrong type throws `TypeError`.

`"compatible"` moves a skipped wall time forward by the gap and keeps the earlier instant of a repeated time. On 2024-03-10 in `America/New_York`, hour `2` and minute `30` do not exist, so the result is 3:30 local, `2024-03-10T07:30:00.000Z`. `"reject"` throws on that gap. On the 2024-11-03 overlap, `"later"` selects the second 1:30, `2024-11-03T06:30:00.000Z`.

## Related

- [`getDateParts`](../get-date-parts/get-date-parts.md) reads the wall-clock fields this function replaces.
- [`createDate`](../create-date/create-date.md) builds an instant from a full set of fields.
- [`addDuration`](../add-duration/add-duration.md) uses the same overflow and disambiguation options.
