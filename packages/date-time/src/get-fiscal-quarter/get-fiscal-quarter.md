# `getFiscalQuarter`

Returns the quarter inside the fiscal year, from 1 through 4.

## Import

```ts
import { getFiscalQuarter } from "@sgx4u/date-time";
```

## Signature

```ts
function getFiscalQuarter(
    date: DateInput,
    options: FiscalYearOptions & TimeZoneOptions,
): 1 | 2 | 3 | 4;
```

## Options

The options argument is required.

| Name                   | Type                         | Default                                 | Meaning                                                                          |
| ---------------------- | ---------------------------- | --------------------------------------- | -------------------------------------------------------------------------------- |
| `fiscalYearStartMonth` | `number`                     | `required`                              | Month the fiscal year starts, from `1` through `12`. April is `4`.               |
| `fiscalYearLabel`      | `"start-year" \| "end-year"` | `"end-year"`                            | Which calendar year labels the fiscal year. The quarter does not use this label. |
| `timeZone`             | `string`                     | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`.             |

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

The first quarter starts on `fiscalYearStartMonth`. A missing start month throws a `TypeError`. A start month outside 1 through 12 throws a `RangeError`. The quarter is read from the calendar day in `timeZone`.

## Related

- [`getFiscalYear`](../get-fiscal-year/get-fiscal-year.md)
- [`getFiscalYearInterval`](../get-fiscal-year-interval/get-fiscal-year-interval.md)
- [`getQuarter`](../get-quarter/get-quarter.md)
