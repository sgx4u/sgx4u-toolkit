# `getFiscalYearInterval`

Returns the half-open interval of a fiscal year.

## Import

```ts
import { getFiscalYearInterval } from "@sgx4u/date-time";
```

## Signature

```ts
function getFiscalYearInterval(
    fiscalYear: number,
    options: FiscalYearOptions & TimeZoneOptions,
): Interval;
```

## Options

The options argument is required.

| Name                   | Type                         | Default                                 | Meaning                                                              |
| ---------------------- | ---------------------------- | --------------------------------------- | -------------------------------------------------------------------- |
| `fiscalYearStartMonth` | `number`                     | `required`                              | Month the fiscal year starts, from `1` through `12`.                 |
| `fiscalYearLabel`      | `"start-year" \| "end-year"` | `"end-year"`                            | Which calendar year the `fiscalYear` argument names.                 |
| `timeZone`             | `string`                     | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`. |

## Examples

```ts
import { getFiscalYearInterval } from "@sgx4u/date-time";

getFiscalYearInterval(2027, {
    fiscalYearStartMonth: 4,
    timeZone: "UTC",
}).start.toISOString();
// "2026-04-01T00:00:00.000Z"

getFiscalYearInterval(2027, {
    fiscalYearStartMonth: 4,
    timeZone: "UTC",
}).end.toISOString();
// "2027-04-01T00:00:00.000Z"

getFiscalYearInterval(2026, {
    fiscalYearStartMonth: 4,
    fiscalYearLabel: "start-year",
    timeZone: "UTC",
}).start.toISOString();
// "2026-04-01T00:00:00.000Z"
```

## Edge cases

The end is the first instant of the next fiscal year, so the interval is half-open. With `"end-year"`, fiscal year 2027 and an April start begins on 1 April 2026. A missing start month throws a `TypeError`.

## Related

- [`getFiscalYear`](../get-fiscal-year/get-fiscal-year.md)
- [`getFiscalQuarter`](../get-fiscal-quarter/get-fiscal-quarter.md)
- [`isWithinInterval`](../is-within-interval/is-within-interval.md)
