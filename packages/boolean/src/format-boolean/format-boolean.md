# `formatBoolean`

Turns a primitive boolean into a word. It does not parse strings. A non-boolean `value` returns `undefined`. The call takes one flat object.

`yes-no` and `y-n` use the locale's first yes word and first no word when that language is known and is not English. For `y-n` outside English the full primary word is used. `true-false`, `on-off`, `enabled-disabled`, `t-f`, and `1-0` keep their English spelling. Capitalization still uses `toLocaleUpperCase(locale)`. `"1-0"` has no letters, so capitalization leaves it unchanged.

## Import

```ts
import { formatBoolean } from "@sgx4u/boolean";
```

## Signature

```ts
function formatBoolean(input: FormatBooleanInput): string | undefined;
```

## Options

| Option           | Type                               | Default        |
| ---------------- | ---------------------------------- | -------------- |
| `value`          | `unknown`                          | required       |
| `style`          | `BooleanFormatStyle`               | `"true-false"` |
| `locale`         | `string`                           | `"en"`         |
| `capitalization` | `"lower" \| "sentence" \| "upper"` | `"lower"`      |

| Style              | `true`    | `false`    |
| ------------------ | --------- | ---------- |
| `true-false`       | `true`    | `false`    |
| `yes-no`           | `yes`     | `no`       |
| `on-off`           | `on`      | `off`      |
| `enabled-disabled` | `enabled` | `disabled` |
| `y-n`              | `y`       | `n`        |
| `t-f`              | `t`       | `f`        |
| `1-0`              | `1`       | `0`        |

`"lower"` keeps the stored spelling, including scripts that have no case. `"sentence"` uppercases the first character. `"upper"` uppercases the whole word.

## Examples

```ts
formatBoolean({ value: true }); // "true"
formatBoolean({
    value: true,
    style: "yes-no",
    locale: "fr",
    capitalization: "sentence",
}); // "Oui"
formatBoolean({ value: "true" }); // undefined
```

With the default English parse options, `parseBoolean(formatBoolean({ value, style })) === value` for every style. Pass the same `locale` to both functions to round-trip a locale yes/no word.

## Edge cases

| Call                                                | Result               |
| --------------------------------------------------- | -------------------- |
| `value` is `null`, a string, or `new Boolean(true)` | `undefined`          |
| `style: "maybe"` or `capitalization: "title"`       | throws `TypeError`   |
| `locale: 1`, or a non-object argument               | throws `TypeError`   |
| `style: "1-0"`, `capitalization: "upper"`           | `"1"` or `"0"`       |
| `locale: "xx"`, `style: "yes-no"`                   | English `yes` / `no` |
