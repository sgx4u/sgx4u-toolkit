# `fromExcelSerialDate`

Returns the date named by a spreadsheet serial number.

## Import

```ts
import { fromExcelSerialDate } from "@sgx4u/date-time";
```

## Signature

```ts
function fromExcelSerialDate(
    params: FromExcelSerialDateParams,
): Date | undefined;
```

## Options

| Name         | Type           | Required | Default     | Meaning                               |
| ------------ | -------------- | -------- | ----------- | ------------------------------------- |
| `serial`     | `number`       | Yes      | —           | Spreadsheet serial number.            |
| `timeZone`   | `string`       | No       | System zone | Zone for the wall time of the serial. |
| `dateSystem` | `1900 \| 1904` | No       | `1900`      | Which serial epoch to use.            |

## Examples

```ts
fromExcelSerialDate({ serial: 1, timeZone: "UTC" })?.toISOString();
// "1900-01-01T00:00:00.000Z"

fromExcelSerialDate({ serial: 61, timeZone: "UTC" })?.toISOString();
// "1900-03-01T00:00:00.000Z"

fromExcelSerialDate({ serial: 0, timeZone: "UTC", dateSystem: 1904 })?.toISOString();
// "1904-01-01T00:00:00.000Z" 
```

## Edge cases

A serial below the epoch for the chosen date system, or a non-finite `serial`, returns `undefined`. An unknown `dateSystem` or an invalid `timeZone` throws.


## Related

- [`toExcelSerialDate`](../to-excel-serial-date/to-excel-serial-date.md) writes the serial for a date.
