# `getISOWeekYear`

Returns the year the ISO week belongs to.

## Import

```ts
import { getISOWeekYear } from "@sgx4u/date-time";
```

## Signature

```ts
function getISOWeekYear(params: GetISOWeekYearParams): number | undefined;
```

## Options

Same fields as `getISOWeek`.

## Examples

```ts
import { getISOWeekYear } from "@sgx4u/date-time";

getISOWeekYear("2026-01-01T00:00:00Z", { timeZone: "UTC" });
// 2026

getISOWeekYear("2025-12-31T00:00:00Z", { timeZone: "UTC" });
// 2026

getISOWeekYear("2023-01-01T00:00:00Z", { timeZone: "UTC" });
// 2022
```

## Edge cases

Invalid `date` returns `undefined`. Invalid `timeZone` throws.


## Related

- [`getISOWeek`](../get-iso-week/get-iso-week.md)
- [`getISOWeeksInYear`](../get-iso-weeks-in-year/get-iso-weeks-in-year.md)
- [`getWeekOfYear`](../get-week-of-year/get-week-of-year.md)
