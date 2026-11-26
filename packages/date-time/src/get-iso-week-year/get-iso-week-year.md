# `getIsoWeekYear`

Returns the year the ISO week belongs to.

## Import

```ts
import { getIsoWeekYear } from "@sgx4u/date-time";
```

## Signature

```ts
function getIsoWeekYear(date: DateInput, options?: TimeZoneOptions): number;
```

## Options

| Name       | Type     | Default                                 | Meaning                                                              |
| ---------- | -------- | --------------------------------------- | -------------------------------------------------------------------- |
| `timeZone` | `string` | The system time zone, read on each call | An IANA time zone name, `"UTC"`, or a fixed offset such as `+05:30`. |

## Examples

```ts
import { getIsoWeekYear } from "@sgx4u/date-time";

getIsoWeekYear("2026-01-01T00:00:00Z", { timeZone: "UTC" });
// 2026

getIsoWeekYear("2025-12-31T00:00:00Z", { timeZone: "UTC" });
// 2026

getIsoWeekYear("2023-01-01T00:00:00Z", { timeZone: "UTC" });
// 2022
```

## Edge cases

The ISO week-year is not always the Gregorian year. 31 December 2025 belongs to week 1 of 2026, and 1 January 2023 belongs to 2022. The date is read in `timeZone`.

## Related

- [`getIsoWeek`](../get-iso-week/get-iso-week.md)
- [`getIsoWeeksInYear`](../get-iso-weeks-in-year/get-iso-weeks-in-year.md)
- [`getWeekOfYear`](../get-week-of-year/get-week-of-year.md)
