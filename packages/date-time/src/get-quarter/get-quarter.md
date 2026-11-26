# `getQuarter`

Returns the calendar quarter, from 1 through 4.

## Import

```ts
import { getQuarter } from "@sgx4u/date-time";
```

## Signature

```ts
function getQuarter(params: GetQuarterParams): 1 | 2 | 3 | 4 | undefined;
```

## Parameters

| Name       | Type        | Required | Default | Meaning                               |
| ---------- | ----------- | -------- | ------- | ------------------------------------- |
| `date`     | `DateInput` | yes      |         | The date to read.                     |
| `timeZone` | `string`    | no       |         | Zone used to read the calendar month. |

## Examples

```ts
import { getQuarter } from "@sgx4u/date-time";

getQuarter({ date: "2026-01-15T00:00:00Z", timeZone: "UTC" });
// 1

getQuarter({ date: "2026-11-26T00:00:00Z", timeZone: "UTC" });
// 4

getQuarter({ date: "2026-04-01T00:00:00Z", timeZone: "UTC" });
// 2
```

## Edge cases

January through March are quarter 1, April through June are quarter 2, July through September are quarter 3, and October through December are quarter 4. The month is read in `timeZone`. A value that is not a real date returns `undefined`.

## Related

- [`getFiscalQuarter`](../get-fiscal-quarter/get-fiscal-quarter.md)
- [`getDayOfYear`](../get-day-of-year/get-day-of-year.md)
- [`getSeason`](../get-season/get-season.md)
