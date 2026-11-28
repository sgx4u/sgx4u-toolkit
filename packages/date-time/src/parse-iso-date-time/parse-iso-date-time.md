# `parseISODateTime`

Parses an ISO 8601, RFC 3339, or RFC 9557 date-time.

## Import

```ts
import { parseISODateTime } from "@sgx4u/date-time";
```

## Signature

```ts
function parseISODateTime(params: ParseISODateTimeParams): Date | undefined;
```

## Parameters

| Name              | Type             | Required | Default        | Meaning                                                   |
| ----------------- | ---------------- | -------- | -------------- | --------------------------------------------------------- |
| `value`           | `string`         | yes      |                | The candidate text.                                       |
| `defaultTimeZone` | `string`         | no       |                | Zone used when the text has no offset.                    |
| `disambiguation`  | `Disambiguation` | no       | `"compatible"` | Which instant to use at a daylight-saving gap or overlap. |

## Examples

```ts
parseISODateTime({ value: "2026-11-26T03:30:00+05:30" })?.toISOString();
// "2026-11-25T22:00:00.000Z"

parseISODateTime({ value: "2026-11-26T00:00:00.123456Z" })?.toISOString();
// "2026-11-26T00:00:00.123Z"

parseISODateTime({ value: "2026-11-26T03:30:00" });
// undefined

parseISODateTime({
    value: "2024-03-10T02:30:00",
    defaultTimeZone: "America/New_York",
})?.toISOString();
// "2024-03-10T07:30:00.000Z"
```

## Edge cases

Text that does not match returns `undefined`. That includes an impossible day, a missing offset when `defaultTimeZone` is omitted, and a bracketed zone that disagrees with the numeric offset. Extra fractional digits are truncated to milliseconds. A value that is not a string throws `TypeError`. An unknown `disambiguation` throws `RangeError`.

`Z`, `±HH:mm`, and `±HHmm` place the instant directly. A bracketed zone or `defaultTimeZone` resolves the wall time in that zone. `"compatible"` moves a skipped time forward by the gap and keeps the earlier instant of a repeated time. On 2024-03-10 in `America/New_York`, `02:30` does not exist: `"compatible"` returns `2024-03-10T07:30:00.000Z`, `"earlier"` returns `2024-03-10T06:30:00.000Z`, and `"reject"` returns `undefined`. On the 2024-11-03 overlap, `01:30` with the default keeps `2024-11-03T05:30:00.000Z`, and `"later"` returns `2024-11-03T06:30:00.000Z`.

## Related

- [`parseISODate`](../parse-iso-date/parse-iso-date.md) reads a calendar date as midnight.
- [`formatISODateTime`](../format-iso-date-time/format-iso-date-time.md) writes an ISO date-time with a numeric offset.
- [`reviveISODateTimes`](../revive-iso-date-times/revive-iso-date-times.md) converts the same offset form inside `JSON.parse`.
