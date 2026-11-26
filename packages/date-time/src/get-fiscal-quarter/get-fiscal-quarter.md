# `getFiscalQuarter`

Returns the quarter inside the fiscal year, from 1 through 4.

## Import

```ts
import { getFiscalQuarter } from "@sgx4u/date-time";
```

## Signature

```ts
function getFiscalQuarter(params: GetFiscalQuarterParams): 1 | 2 | 3 | 4 | undefined;
```

## Options

| Name                   | Type        | Required | Default                                 | Meaning                                                              |
| ---------------------- | ----------- | -------- | --------------------------------------- | -------------------------------------------------------------------- |
| `date`                 | `DateInput` | Yes      | —                                       | The date to read.                                                    |
| `fiscalYearStartMonth` | `number`    | Yes      | —                                       | Month the fiscal year starts, from 1 through 12.                     |
| `fiscalYearLabel`      | string      | No       | `"end-year"`                            | Which calendar year labels the fiscal year.                          |
| `timeZone`             | `string`    | No       | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`. |

## Examples

```ts
import { getFiscalQuarter } from "@sgx4u/date-time";

getFiscalQuarter("2026-04-01T00:00:00Z", {
    fiscalYearStartMonth: 4,
    timeZone: "UTC",
});
// 1

getFiscalQuarter("2026-07-01T00:00:00Z", {
    fiscalYearStartMonth: 4,
    timeZone: "UTC",
});
// 2

getFiscalQuarter("2026-03-31T00:00:00Z", {
    fiscalYearStartMonth: 4,
    timeZone: "UTC",
});
// 4
```

## Edge cases

Invalid `date` returns `undefined`. Missing or invalid `fiscalYearStartMonth`, `fiscalYearLabel`, or `timeZone` throws.


## Related

- [`getFiscalYear`](../get-fiscal-year/get-fiscal-year.md)
- [`getFiscalYearInterval`](../get-fiscal-year-interval/get-fiscal-year-interval.md)
- [`getQuarter`](../get-quarter/get-quarter.md)
