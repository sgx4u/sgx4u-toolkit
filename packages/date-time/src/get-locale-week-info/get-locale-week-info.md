# `getLocaleWeekInfo`

Returns the week rules the runtime reports for a locale.

## Import

```ts
import { getLocaleWeekInfo } from "@sgx4u/date-time";
```

## Signature

```ts
function getLocaleWeekInfo(locale?: string): LocaleWeekInfo;
```

## Parameters

| Name     | Type     | Required | Default | Meaning                                          |
| -------- | -------- | -------- | ------- | ------------------------------------------------ |
| `locale` | `string` | no       |         | A BCP 47 tag. Omit it to use the runtime locale. |

## Examples

```ts
import { getLocaleWeekInfo } from "@sgx4u/date-time";

getLocaleWeekInfo("en-US").firstDay;
// 7

getLocaleWeekInfo("en-GB");
// { firstDay: 1, weekendDays: [6, 7], minimumDaysInFirstWeek: 4 }

getLocaleWeekInfo("en-US").weekendDays;
// [6, 7]
```

## Edge cases

An invalid `locale` throws.

## Related

- [`getWeekOfYear`](../get-week-of-year/get-week-of-year.md)
- [`getWeekdayNames`](../get-weekday-names/get-weekday-names.md)
- [`isWeekend`](../is-weekend/is-weekend.md)
