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

## Options

| Name     | Type     | Default                      | Meaning                                            |
| -------- | -------- | ---------------------------- | -------------------------------------------------- |
| `locale` | `string` | The runtime's default locale | A BCP 47 language tag passed as the only argument. |

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

The result is one of `"h11"`, `"h12"`, `"h23"`, or `"h24"`, using the runtime's locale data. Omit `locale` to use the runtime's default locale.

## Related

- [`getLocaleDatePattern`](../get-locale-date-pattern/get-locale-date-pattern.md)
- [`getLocaleWeekInfo`](../get-locale-week-info/get-locale-week-info.md)
- [`getTimeOfDay`](../get-time-of-day/get-time-of-day.md)
