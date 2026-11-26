# `getFiscalYear`

Returns the fiscal year label for a date.

## Import

```ts
import { getFiscalYear } from "@sgx4u/date-time";
```

## Signature

```ts
function getFiscalYear(
    date: DateInput,
    options: FiscalYearOptions & TimeZoneOptions,
): number;
```

## Options

The options argument is required.

| Name                   | Type                         | Default                                 | Meaning                                                              |
| ---------------------- | ---------------------------- | --------------------------------------- | -------------------------------------------------------------------- |
| `fiscalYearStartMonth` | `number`                     | `required`                              | Month the fiscal year starts, from `1` through `12`. April is `4`.   |
| `fiscalYearLabel`      | `"start-year" \| "end-year"` | `"end-year"`                            | Which calendar year labels the fiscal year.                          |
| `timeZone`             | `string`                     | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`. |

## Examples

```ts
import { getFiscalYear } from "@sgx4u/date-time";

getFiscalYear("2026-04-01T00:00:00Z", {
    fiscalYearStartMonth: 4,
    timeZone: "UTC",
});
// 2027

getFiscalYear("2026-04-01T00:00:00Z", {
    fiscalYearStartMonth: 4,
    fiscalYearLabel: "start-year",
    timeZone: "UTC",
});
// 2026

getFiscalYear("2026-03-31T00:00:00Z", {
    fiscalYearStartMonth: 4,
    timeZone: "UTC",
});
// 2026

getFiscalYear("2026-06-01T00:00:00Z", {
    fiscalYearStartMonth: 1,
    timeZone: "UTC",
});
// 2026
```

## Edge cases

With April and the default `"end-year"` label, 1 April 2026 through 31 March 2027 is fiscal year 2027. `"start-year"` labels that span 2026. A start month of January matches the calendar year. A missing start month throws a `TypeError`.

## Related

- [`getFiscalQuarter`](../get-fiscal-quarter/get-fiscal-quarter.md)
- [`getFiscalYearInterval`](../get-fiscal-year-interval/get-fiscal-year-interval.md)
- [`getQuarter`](../get-quarter/get-quarter.md)
