# `getIsoWeek`

Returns the ISO week number, from 1 through 53.

## Import

```ts
import { getIsoWeek } from "@sgx4u/date-time";
```

## Signature

```ts
function getIsoWeek(date: DateInput, options?: TimeZoneOptions): number;
```

## Options

| Name       | Type     | Default                                 | Meaning                                                              |
| ---------- | -------- | --------------------------------------- | -------------------------------------------------------------------- |
| `timeZone` | `string` | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`. |

## Examples

```ts
import { getIsoWeek } from "@sgx4u/date-time";

getIsoWeek("2026-01-01T00:00:00Z", { timeZone: "UTC" });
// 1

getIsoWeek("2025-12-31T00:00:00Z", { timeZone: "UTC" });
// 1

getIsoWeek("2023-01-01T00:00:00Z", { timeZone: "UTC" });
// 52
```

## Edge cases

ISO weeks start on Monday, and week 1 is the week that contains the first Thursday. A date in late December can belong to week 1 of the next year, and 1 January can belong to week 52 or 53 of the previous year. The week is read in `timeZone`.

## Related

- [`getIsoWeekYear`](../get-iso-week-year/get-iso-week-year.md)
- [`getIsoWeeksInYear`](../get-iso-weeks-in-year/get-iso-weeks-in-year.md)
- [`getWeekOfYear`](../get-week-of-year/get-week-of-year.md)
