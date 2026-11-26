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

## Parameters

| Name       | Type        | Required | Default                                  | Meaning                                            |
| ---------- | ----------- | -------- | ---------------------------------------- | -------------------------------------------------- |
| `date`     | `DateInput` | yes      |                                          | The date to read.                                  |
| `timeZone` | `string`    | no       | The system time zone, read on each call. | An IANA time zone name, `"UTC"`, or a fixed offset |

## Examples

```ts
import { getISOWeek } from "@sgx4u/date-time";

getISOWeek({ date: "2026-01-01T00:00:00Z", timeZone: "UTC" });
// 1

getISOWeek({ date: "2025-12-31T00:00:00Z", timeZone: "UTC" });
// 1

getISOWeek({ date: "2023-01-01T00:00:00Z", timeZone: "UTC" });
// 52
```

## Edge cases

Invalid `date` returns `undefined`. Invalid `timeZone` throws.

## Related

- [`getISOWeekYear`](../get-iso-week-year/get-iso-week-year.md)
- [`getISOWeeksInYear`](../get-iso-weeks-in-year/get-iso-weeks-in-year.md)
- [`getWeekOfYear`](../get-week-of-year/get-week-of-year.md)
