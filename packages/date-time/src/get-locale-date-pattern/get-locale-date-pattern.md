# `getLocaleDatePattern`

Returns the locale's numeric date pattern, such as `dd/MM/yyyy`.

## Import

```ts
import { getLocaleDatePattern } from "@sgx4u/date-time";
```

## Signature

```ts
function getLocaleDatePattern(options?: LocaleDatePatternOptions): string;
```

## Options

| Name     | Type                          | Default                      | Meaning                                                       |
| -------- | ----------------------------- | ---------------------------- | ------------------------------------------------------------- |
| `locale` | `string \| readonly string[]` | The runtime's default locale | A BCP 47 language tag, or a list of tags in preference order. |
| `style`  | `"short" \| "medium"`         | `"short"`                    | Accepted date style. Any other value throws.                  |

## Examples

```ts
import { getLocaleDatePattern } from "@sgx4u/date-time";

getLocaleDatePattern({ locale: "en-US" });
// "MM/dd/yyyy"

getLocaleDatePattern({ locale: "en-GB" });
// "dd/MM/yyyy"

getLocaleDatePattern({ locale: "en-US", style: "medium" });
// "MM/dd/yyyy"
```

## Edge cases

The pattern is the locale's numeric order of day, month, and year, taken from the runtime's locale data. Both `"short"` and `"medium"` use that numeric order: day, month, and year become `dd`, `MM`, and `yyyy`, and other parts are copied as separators. Any other `style` throws a `RangeError`.

## Related

- [`matchesDatePattern`](../matches-date-pattern/matches-date-pattern.md)
- [`getLocaleHourCycle`](../get-locale-hour-cycle/get-locale-hour-cycle.md)
- [`getMonthNames`](../get-month-names/get-month-names.md)
