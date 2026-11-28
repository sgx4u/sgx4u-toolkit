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

## Parameters

| Name             | Type             | Required | Default                                  | Meaning                                                   |
| ---------------- | ---------------- | -------- | ---------------------------------------- | --------------------------------------------------------- |
| `year`           | `number`         | yes      |                                          |                                                           |
| `month`          | `number`         | no       |                                          |                                                           |
| `day`            | `number`         | no       |                                          |                                                           |
| `hour`           | `number`         | no       |                                          |                                                           |
| `minute`         | `number`         | no       |                                          |                                                           |
| `second`         | `number`         | no       |                                          |                                                           |
| `millisecond`    | `number`         | no       |                                          |                                                           |
| `timeZone`       | `string`         | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset        |
| `disambiguation` | `Disambiguation` | no       | `"compatible"`                           | Which instant to use at a daylight-saving gap or overlap. |

## Examples

```ts
createDate({
    parts: {
        year: 2026,
        month: 11,
        day: 26,
        hour: 9,
        timeZone: "Asia/Kolkata",
    },
})?.toISOString();
// "2026-11-26T03:30:00.000Z"
```

## Edge cases

Invalid or out-of-range parts return `undefined`. An unusable `timeZone` or `disambiguation` throws `RangeError`. `"reject"` throws on a daylight-saving gap or overlap.

## Related

- [`getDateParts`](../get-date-parts/get-date-parts.md) reads the fields back.
- [`toDate`](../to-date/to-date.md) accepts a string or timestamp.
