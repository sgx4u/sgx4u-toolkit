# `fromExcelSerialDate`

Returns the date named by a spreadsheet serial number.

## Import

```ts
import { fromExcelSerialDate } from "@sgx4u/date-time";
```

## Signature

```ts
function fromExcelSerialDate(
    serial: number,
    options?: TimeZoneOptions & { dateSystem?: 1900 | 1904 },
): Date;
```

## Options

| Name         | Type           | Default     | Meaning                               |
| ------------ | -------------- | ----------- | ------------------------------------- |
| `timeZone`   | `string`       | System zone | Zone for the wall time of the serial. |
| `dateSystem` | `1900 \| 1904` | `1900`      | Which serial epoch to use.            |

## Examples

```ts
fromExcelSerialDate(1, { timeZone: "UTC" }).toISOString();
// "1900-01-01T00:00:00.000Z"

fromExcelSerialDate(60, { timeZone: "UTC" }).toISOString();
// "1900-03-01T00:00:00.000Z"

fromExcelSerialDate(61, { timeZone: "UTC" }).toISOString();
// "1900-03-01T00:00:00.000Z"

fromExcelSerialDate(0, { timeZone: "UTC", dateSystem: 1904 }).toISOString();
// "1904-01-01T00:00:00.000Z"
```

## Edge cases

In the 1900 system, serial 1 is 1900-01-01 and both 60 and 61 are 1900-03-01. The fraction is the time of day: `60.5` is noon on 1900-03-01. A serial below 1 in the 1900 system, or below 0 in the 1904 system, throws `RangeError`. A non-number throws `TypeError`. In the 1904 system, serial 60 is 1904-03-01.

## Related

- [`toExcelSerialDate`](../to-excel-serial-date/to-excel-serial-date.md) writes the serial for a date.
