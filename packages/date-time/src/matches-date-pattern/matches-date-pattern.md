# `matchesDatePattern`

Reports whether text fits a date pattern and is a real date.

## Import

```ts
import { matchesDatePattern } from "@sgx4u/date-time";
```

## Signature

```ts
function matchesDatePattern(params: MatchesDatePatternParams): boolean;
```

## Parameters

| Name      | Type                          | Required | Default                       | Meaning                                                       |
| --------- | ----------------------------- | -------- | ----------------------------- | ------------------------------------------------------------- |
| `value`   | `string`                      | yes      |                               | The text to test.                                             |
| `pattern` | `string`                      | yes      |                               | The CLDR-style pattern.                                       |
| `locale`  | `string \| readonly string[]` | no       | The runtime's default locale. | A BCP 47 language tag, or a list of tags in preference order. |

## Examples

```ts
import { matchesDatePattern } from "@sgx4u/date-time";

matchesDatePattern({ value: "2026-11-26", pattern: "yyyy-MM-dd" });
// true

matchesDatePattern({ value: "26/11/2026", pattern: "dd/MM/yyyy" });
// true

matchesDatePattern({ value: "2026-02-30", pattern: "yyyy-MM-dd" });
// false

matchesDatePattern({ value: "11/26/2026", pattern: "yyyy-MM-dd" });
// false
```

## Edge cases

The text must match the pattern and be a real calendar date. 30 February does not match. `value` and `pattern` must be strings. An unknown pattern token throws a `RangeError`. `locale` supplies names when the pattern uses them.

## Related

- [`getLocaleDatePattern`](../get-locale-date-pattern/get-locale-date-pattern.md)
- [`isValidDate`](../is-valid-date/is-valid-date.md)
- [`getMonthNames`](../get-month-names/get-month-names.md)
