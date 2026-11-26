# `getDayOfYear`

Returns the day of the year, from 1 through 366.

## Import

```ts
import { getDayOfYear } from "@sgx4u/date-time";
```

## Signature

```ts
function getDayOfYear(params: GetDayOfYearParams): number | undefined;
```

## Parameters

| Name       | Type        | Required | Default                                  | Meaning                                            |
| ---------- | ----------- | -------- | ---------------------------------------- | -------------------------------------------------- |
| `date`     | `DateInput` | yes      |                                          | The date to read.                                  |
| `timeZone` | `string`    | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset |

## Examples

```ts
import { getDayOfYear } from "@sgx4u/date-time";

getDayOfYear({ date: "2024-01-01T00:00:00Z", timeZone: "UTC" });
// 1

getDayOfYear({ date: "2024-03-01T00:00:00Z", timeZone: "UTC" });
// 61

getDayOfYear({ date: "2023-03-01T00:00:00Z", timeZone: "UTC" });
// 60
```

## Edge cases

Invalid `date` returns `undefined`. An invalid `timeZone` throws.

## Related

- [`getDaysInYear`](../get-days-in-year/get-days-in-year.md)
- [`isLeapYear`](../is-leap-year/is-leap-year.md)
- [`getQuarter`](../get-quarter/get-quarter.md)
