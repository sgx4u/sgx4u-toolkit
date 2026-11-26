# `createDate`

Builds the instant for wall-clock fields in a time zone.

## Import

```ts
import { createDate } from "@sgx4u/date-time";
```

## Signature

```ts
function createDate(params: CreateDateParams): Date | undefined;
```

## Options

| Name             | Type                                               | Required | Default        | Meaning                                  |
| ---------------- | -------------------------------------------------- | -------- | -------------- | ---------------------------------------- |
| `year`           | `number`                                           | yes      |                | Gregorian year.                          |
| `month`          | `number`                                           | no       | `1`            | Month from 1 through 12.                 |
| `day`            | `number`                                           | no       | `1`            | Day of month.                            |
| `hour`           | `number`                                           | no       | `0`            | Hour from 0 through 23.                  |
| `minute`         | `number`                                           | no       | `0`            | Minute from 0 through 59.              |
| `second`         | `number`                                           | no       | `0`            | Second from 0 through 59.              |
| `millisecond`    | `number`                                           | no       | `0`            | Millisecond from 0 through 999.          |
| `timeZone`       | `string`                                           | no       | System zone    | IANA name or fixed offset.               |
| `disambiguation` | `"compatible" \| "earlier" \| "later" \| "reject"` | no       | `"compatible"` | How to treat a skipped or repeated time. |

## Examples

```ts
createDate({
    year: 2026,
    month: 11,
    day: 26,
    hour: 9,
    timeZone: "Asia/Kolkata",
})?.toISOString();
// "2026-11-26T03:30:00.000Z"
```

## Edge cases

Invalid or out-of-range parts return `undefined`. An unusable `timeZone` or `disambiguation` throws `RangeError`. `"reject"` throws on a daylight-saving gap or overlap.

## Related

- [`getDateParts`](../get-date-parts/get-date-parts.md) reads the fields back.
- [`toDate`](../to-date/to-date.md) accepts a string or timestamp.