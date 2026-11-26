# `getLocaleHourCycle`

Reports whether a locale uses a 12-hour or 24-hour clock.

## Import

```ts
import { getLocaleHourCycle } from "@sgx4u/date-time";
```

## Signature

```ts
function getLocaleHourCycle(locale?: string): "h11" | "h12" | "h23" | "h24";
```

## Parameters

| Name     | Type     | Required | Default | Meaning                                          |
| -------- | -------- | -------- | ------- | ------------------------------------------------ |
| `locale` | `string` | no       |         | A BCP 47 tag. Omit it to use the runtime locale. |

## Examples

```ts
import { getLocaleHourCycle } from "@sgx4u/date-time";

getLocaleHourCycle("en-US");
// "h12"

getLocaleHourCycle("en-GB");
// "h23"

getLocaleHourCycle("de");
// "h23"
```

## Edge cases

An invalid `locale` throws.

## Related

- [`getLocaleDatePattern`](../get-locale-date-pattern/get-locale-date-pattern.md)
- [`getLocaleWeekInfo`](../get-locale-week-info/get-locale-week-info.md)
- [`getTimeOfDay`](../get-time-of-day/get-time-of-day.md)
