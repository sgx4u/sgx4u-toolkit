# `getISOWeek`

Returns the ISO week number, from 1 through 53.

## Import

```ts
import { getISOWeek } from "@sgx4u/date-time";
```

## Signature

```ts
function getISOWeek(params: GetISOWeekParams): number | undefined;
```

## Options

| Name       | Type        | Required | Default     | Meaning     |
| ---------- | ----------- | -------- | ----------- | ----------- |
| `date`     | `DateInput` | Yes      | —           | Date.       |
| `timeZone` | `string`    | No       | System zone | Wall clock. |

## Examples

```ts
import { getISOWeek } from "@sgx4u/date-time";

getISOWeek("2026-01-01T00:00:00Z", { timeZone: "UTC" });
// 1

getISOWeek("2025-12-31T00:00:00Z", { timeZone: "UTC" });
// 1

getISOWeek("2023-01-01T00:00:00Z", { timeZone: "UTC" });
// 52
```

## Edge cases

Invalid `date` returns `undefined`. Invalid `timeZone` throws.


## Related

- [`getISOWeekYear`](../get-iso-week-year/get-iso-week-year.md)
- [`getISOWeeksInYear`](../get-iso-weeks-in-year/get-iso-weeks-in-year.md)
- [`getWeekOfYear`](../get-week-of-year/get-week-of-year.md)
