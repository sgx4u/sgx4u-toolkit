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

## Parameters

| Name         | Type           | Required | Default                                  | Meaning                                            |
| ------------ | -------------- | -------- | ---------------------------------------- | -------------------------------------------------- |
| `serial`     | `number`       | yes      |                                          | The spreadsheet serial number.                     |
| `dateSystem` | `1900 \| 1904` | no       | `1900`                                   | Which epoch the serial uses.                       |
| `timeZone`   | `string`       | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset |

## Examples

```ts
fromExcelSerialDate({ serial: 1, timeZone: "UTC" })?.toISOString();
// "1900-01-01T00:00:00.000Z"

fromExcelSerialDate({ serial: 61, timeZone: "UTC" })?.toISOString();
// "1900-03-01T00:00:00.000Z"

fromExcelSerialDate({
    serial: 0,
    timeZone: "UTC",
    dateSystem: 1904,
})?.toISOString();
// "1904-01-01T00:00:00.000Z"
```

## Edge cases

A serial below the epoch for the chosen date system, or a non-finite `serial`, returns `undefined`. An unknown `dateSystem` or an invalid `timeZone` throws.

## Related

- [`toExcelSerialDate`](../to-excel-serial-date/to-excel-serial-date.md) writes the serial for a date.
