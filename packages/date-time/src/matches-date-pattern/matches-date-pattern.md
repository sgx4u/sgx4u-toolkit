# `matchesDatePattern`

Reports whether text fits a date pattern and is a real date.

## Import

```ts
import { matchesDatePattern } from "@sgx4u/date-time";
```

## Signature

```ts
function matchesDatePattern(
    value: string,
    pattern: string,
    options?: LocaleOptions,
): boolean;
```

## Options

| Name     | Type                          | Default                      | Meaning                                                       |
| -------- | ----------------------------- | ---------------------------- | ------------------------------------------------------------- |
| `locale` | `string \| readonly string[]` | The runtime's default locale | A BCP 47 language tag, or a list of tags in preference order. |

## Examples

```ts
import { matchesDatePattern } from "@sgx4u/date-time";

matchesDatePattern("2026-11-26", "yyyy-MM-dd");
// true

matchesDatePattern("26/11/2026", "dd/MM/yyyy");
// true

matchesDatePattern("2026-02-30", "yyyy-MM-dd");
// false

matchesDatePattern("11/26/2026", "yyyy-MM-dd");
// false
```

## Edge cases

The text must match the pattern and be a real calendar date. 30 February does not match. `value` and `pattern` must be strings. An unknown pattern token throws a `RangeError`. `locale` supplies names when the pattern uses them.

## Related

- [`getLocaleDatePattern`](../get-locale-date-pattern/get-locale-date-pattern.md)
- [`isValidDate`](../is-valid-date/is-valid-date.md)
- [`getMonthNames`](../get-month-names/get-month-names.md)
