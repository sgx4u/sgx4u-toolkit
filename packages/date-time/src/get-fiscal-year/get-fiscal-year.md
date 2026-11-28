# `getFiscalYear`

Returns the fiscal year label for a date.

## Import

```ts
import { getFiscalYear } from "@sgx4u/date-time";
```

## Signature

```ts
function getFiscalYear(params: GetFiscalYearParams): number | undefined;
```

## Parameters

| Name                   | Type                         | Required | Default                                  | Meaning                                                            |
| ---------------------- | ---------------------------- | -------- | ---------------------------------------- | ------------------------------------------------------------------ |
| `date`                 | `DateInput`                  | yes      |                                          | The date to label.                                                 |
| `fiscalYearStartMonth` | `number`                     | yes      |                                          | Month the fiscal year starts, from `1` through `12`. April is `4`. |
| `fiscalYearLabel`      | `"start-year" \| "end-year"` | no       | `"end-year"`                             | Which calendar year labels the fiscal year.                        |
| `timeZone`             | `string`                     | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset                 |

## Examples

```ts
import { getFiscalYear } from "@sgx4u/date-time";

getFiscalYear({
    date: "2026-04-01T00:00:00Z",
    fiscalYearStartMonth: 4,
    timeZone: "UTC",
});
// 2027

getFiscalYear({
    date: "2026-04-01T00:00:00Z",
    fiscalYearStartMonth: 4,
    fiscalYearLabel: "start-year",
    timeZone: "UTC",
});
// 2026

getFiscalYear({
    date: "2026-03-31T00:00:00Z",
    fiscalYearStartMonth: 4,
    timeZone: "UTC",
});
// 2026

getFiscalYear({
    date: "2026-06-01T00:00:00Z",
    fiscalYearStartMonth: 1,
    timeZone: "UTC",
});
// 2026
```

## Edge cases

Invalid `date` returns `undefined`. Missing or invalid fiscal options or `timeZone` throws.

## Related

- [`getFiscalQuarter`](../get-fiscal-quarter/get-fiscal-quarter.md)
- [`getFiscalYearInterval`](../get-fiscal-year-interval/get-fiscal-year-interval.md)
- [`getQuarter`](../get-quarter/get-quarter.md)
