# `toExcelSerialDate`

Returns the spreadsheet serial number of a date.

## Import

```ts
import { toExcelSerialDate } from "@sgx4u/date-time";
```

## Signature

```ts
function toExcelSerialDate(params: ToExcelSerialDateParams): number | undefined;
```

## Parameters

| Name         | Type           | Required | Default                                  | Meaning                                                              |
| ------------ | -------------- | -------- | ---------------------------------------- | -------------------------------------------------------------------- |
| `date`       | `DateInput`    | yes      |                                          | The instant to convert.                                              |
| `dateSystem` | `1900 \| 1904` | no       | `1900`                                   | `1900` includes the fictional leap day. `1904` starts at 1904-01-01. |
| `timeZone`   | `string`       | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset                   |

## Examples

```ts
toExcelSerialDate({ date: "1900-01-01T00:00:00Z", timeZone: "UTC" });
// 1

toExcelSerialDate({ date: "1900-01-01T12:00:00Z", timeZone: "UTC" });
// 1.5

toExcelSerialDate({ date: "1900-03-01T00:00:00Z", timeZone: "UTC" });
// 61

toExcelSerialDate({
    date: "1904-01-01T00:00:00Z",
    timeZone: "UTC",
    dateSystem: 1904,
});
// 0
```

## Edge cases

The integer is the calendar day in `timeZone` and the fraction is the time of day there. The 1900 system returns 61 for 1900-03-01 and never returns 60. A date before the epoch throws `RangeError`: 1900-01-01 for the 1900 system, and 1904-01-01 for the 1904 system. An unknown `dateSystem` throws `RangeError`.

Daylight saving changes the local day and the fraction. `2024-01-15T05:00:00Z` is midnight in `America/New_York` and serial `45306`. `2024-07-15T04:00:00Z` is midnight there in summer time and serial `45488`. On the 2024 spring-forward, `2024-03-10T06:30:00Z` is 1:30 local and serial `45361.0625`, while `2024-03-10T07:30:00Z` is 3:30 local because 2:00 does not exist.

## Related

- [`fromExcelSerialDate`](../from-excel-serial-date/from-excel-serial-date.md) returns the date named by a serial number.
- [`getDateParts`](../get-date-parts/get-date-parts.md) reads the wall-clock fields the serial uses.
