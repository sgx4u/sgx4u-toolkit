# `getWeekdayNames`

Returns the 7 weekday names, starting on `startsOn`.

## Import

```ts
import { getWeekdayNames } from "@sgx4u/date-time";
```

## Signature

```ts
function getWeekdayNames(params: GetWeekdayNamesParams = {}): string[];
```

## Parameters

| Name       | Type                            | Required | Default                       | Meaning                                                       |
| ---------- | ------------------------------- | -------- | ----------------------------- | ------------------------------------------------------------- |
| `width`    | `"long" \| "short" \| "narrow"` | no       | `"long"`                      | The name length.                                              |
| `startsOn` | `Weekday`                       | no       | `1`                           | The ISO weekday that comes first.                             |
| `locale`   | `string \| readonly string[]`   | no       | The runtime's default locale. | A BCP 47 language tag, or a list of tags in preference order. |

## Examples

```ts
import { getWeekdayNames } from "@sgx4u/date-time";

getWeekdayNames({ locale: "en-US" })[0];
// "Monday"

getWeekdayNames({ locale: "en-US", width: "short" })[0];
// "Mon"

getWeekdayNames({ locale: "en-US", startsOn: 7 })[0];
// "Sunday"
```

## Edge cases

The names come from the runtime for a fixed UTC week, so the result does not depend on the system zone. Monday 3 January 2000 is the reference Monday. An invalid `width` or `startsOn` throws a `RangeError`.

## Related

- [`getMonthNames`](../get-month-names/get-month-names.md)
- [`getLocaleWeekInfo`](../get-locale-week-info/get-locale-week-info.md)
- [`getNextWeekday`](../get-next-weekday/get-next-weekday.md)
