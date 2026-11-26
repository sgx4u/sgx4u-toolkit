# `getLocaleDatePattern`

Returns the locale's numeric date pattern, such as `dd/MM/yyyy`.

## Import

```ts
import { getLocaleDatePattern } from "@sgx4u/date-time";
```

## Signature

```ts
function getLocaleDatePattern(params?: GetLocaleDatePatternParams): string;
```

## Options

| Name     | Type                  | Required | Default     | Meaning              |
| -------- | --------------------- | -------- | ----------- | -------------------- |
| `locale` | `string \| string[]` | No       | Runtime     | BCP 47 tag or list.  |
| `style`  | `"short" \| "medium"`| No       | `"short"`   | Date style to read.  |

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
