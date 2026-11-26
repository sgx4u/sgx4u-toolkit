# `getLocaleDatePattern`

Returns the locale's numeric date pattern, such as `dd/MM/yyyy`.

## Import

```ts
import { getLocaleDatePattern } from "@sgx4u/date-time";
```

## Signature

```ts
function getLocaleDatePattern(params: GetLocaleDatePatternParams): string;
```

## Parameters

| Name     | Type                          | Required | Default                       | Meaning                                                       |
| -------- | ----------------------------- | -------- | ----------------------------- | ------------------------------------------------------------- |
| `style`  | `"short" \| "medium"`         | no       | `"short"`                     | The `Intl` date style used to discover the pattern.           |
| `locale` | `string \| readonly string[]` | no       | The runtime's default locale. | A BCP 47 language tag, or a list of tags in preference order. |

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

Invalid `locale` or `style` throws.

## Related

- [`matchesDatePattern`](../matches-date-pattern/matches-date-pattern.md)
- [`getLocaleHourCycle`](../get-locale-hour-cycle/get-locale-hour-cycle.md)
- [`getMonthNames`](../get-month-names/get-month-names.md)
