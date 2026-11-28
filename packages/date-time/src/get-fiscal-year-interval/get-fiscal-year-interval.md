# `getFiscalYearInterval`

Returns the half-open interval of a fiscal year.

## Import

```ts
import { getFiscalYearInterval } from "@sgx4u/date-time";
```

## Signature

```ts
function getFiscalYearInterval(
    params: GetFiscalYearIntervalParams,
): Interval | undefined;
```

## Parameters

| Name                   | Type                         | Required | Default                                  | Meaning                                                            |
| ---------------------- | ---------------------------- | -------- | ---------------------------------------- | ------------------------------------------------------------------ |
| `fiscalYear`           | `number`                     | yes      |                                          | The fiscal year label, such as 2027 for an April-to-March year.    |
| `fiscalYearStartMonth` | `number`                     | yes      |                                          | Month the fiscal year starts, from `1` through `12`. April is `4`. |
| `fiscalYearLabel`      | `"start-year" \| "end-year"` | no       | `"end-year"`                             | Which calendar year labels the fiscal year.                        |
| `timeZone`             | `string`                     | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset                 |

## Examples

```ts
import { getFiscalYearInterval } from "@sgx4u/date-time";

getFiscalYearInterval({
    fiscalYear: 2027,
    fiscalYearStartMonth: 4,
    timeZone: "UTC",
}).start.toISOString();
// "2026-04-01T00:00:00.000Z"

getFiscalYearInterval({
    fiscalYear: 2027,
    fiscalYearStartMonth: 4,
    timeZone: "UTC",
}).end.toISOString();
// "2027-04-01T00:00:00.000Z"

getFiscalYearInterval({
    fiscalYear: 2026,
    fiscalYearStartMonth: 4,
    fiscalYearLabel: "start-year",
    timeZone: "UTC",
}).start.toISOString();
// "2026-04-01T00:00:00.000Z"
```

## Edge cases

A non-integer `fiscalYear` returns `undefined`. Missing or invalid fiscal options or `timeZone` throws.

## Related

- [`getFiscalYear`](../get-fiscal-year/get-fiscal-year.md)
- [`getFiscalQuarter`](../get-fiscal-quarter/get-fiscal-quarter.md)
- [`isWithinInterval`](../is-within-interval/is-within-interval.md)
