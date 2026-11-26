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

## Options

| Name     | Type     | Default                      | Meaning                                            |
| -------- | -------- | ---------------------------- | -------------------------------------------------- |
| `locale` | `string` | The runtime's default locale | A BCP 47 language tag passed as the only argument. |

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

`firstDay` is an ISO weekday. When the runtime has no week data for the locale, the result is the ISO default: Monday, weekend Saturday and Sunday, and four days in the first week.

## Related

- [`getWeekOfYear`](../get-week-of-year/get-week-of-year.md)
- [`getWeekdayNames`](../get-weekday-names/get-weekday-names.md)
- [`isWeekend`](../is-weekend/is-weekend.md)
