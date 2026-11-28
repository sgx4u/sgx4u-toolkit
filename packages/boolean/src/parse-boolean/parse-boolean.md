# `parseBoolean`

Turns a recognized token into `true` or `false`. Anything else returns `undefined`, or `fallback` when one was given. It does not coerce with `!!` and it does not treat every non-empty string as `true`.

Pass the value alone, or one object that owns `value`. Do not pass `(value, options)`.

## Import

```ts
import { parseBoolean } from "@sgx4u/boolean";
```

## Signature

```ts
function parseBoolean(value: unknown): boolean | undefined;
function parseBoolean(
    input: ParseBooleanInput & { fallback: boolean },
): boolean;
function parseBoolean(input: ParseBooleanInput): boolean | undefined;
```

## Options

| Option          | Type                    | Default                                                |
| --------------- | ----------------------- | ------------------------------------------------------ |
| `locale`        | `string`                | omitted. English tokens still apply in `"extend"` mode |
| `truthyWords`   | `readonly string[]`     | omitted                                                |
| `falsyWords`    | `readonly string[]`     | omitted                                                |
| `wordListMode`  | `"extend" \| "replace"` | `"extend"`                                             |
| `caseSensitive` | `boolean`               | `false`                                                |
| `trim`          | `boolean`               | `true`                                                 |
| `lenient`       | `boolean`               | `false`                                                |
| `fallback`      | `boolean`               | omitted. Unrecognized values return `undefined`        |

`"extend"` adds custom words to the English tokens and, when `locale` is set, that language's yes/no words. `"replace"` uses only the custom lists. Primitive `true` and `false`, and the numbers `0` and `1`, stay accepted in both modes. `-0` is `false` because `-0 === 0`. The strings `"1.0"`, `"00"`, `"+1"`, and `"0x1"` are not tokens.

Default English tokens, after trim and `toLowerCase()`:

| Meaning | Tokens                                                     |
| ------- | ---------------------------------------------------------- |
| `true`  | `true`, `t`, `yes`, `y`, `on`, `1`, `enable`, `enabled`    |
| `false` | `false`, `f`, `no`, `n`, `off`, `0`, `disable`, `disabled` |

`no` uses the Norwegian Bokmål words stored as `nb`. A structurally invalid `locale`, such as `""` or `fr_FR`, adds no words and does not throw.

`lenient` runs only after those lists miss. It accepts English `yes` or `no` with exactly one character replaced by a QWERTY neighbor. `yss` matches `yes` because `s` is next to `e`. `mo` matches `no` because `m` is next to `n`. An extra letter, a missing letter, or a swap does not match. Locale words, `true` / `false`, `on` / `off`, and custom words are not typo-matched.

An object is the options form only when it has an own `value` property. Other objects are values and are not tokens.

## Examples

```ts
parseBoolean(" YES "); // true
parseBoolean(-0); // false
parseBoolean({ value: "oui", locale: "fr" }); // true
parseBoolean({ value: "maybe", fallback: false }); // false
parseBoolean({ value: "yss", lenient: true }); // true
```

## Edge cases

| Value                                               | Result                           |
| --------------------------------------------------- | -------------------------------- |
| `true`, `false`                                     | that boolean                     |
| `0`, `-0`, `1`, `1.0`                               | `false`, `false`, `true`, `true` |
| `"  yes  "` with `trim: false`                      | `undefined`                      |
| `"YES"` with `caseSensitive: true`                  | `undefined`                      |
| `"maybe"`, `""`, `"2"`, `null`, `new Boolean(true)` | `undefined`                      |
| `truthyWords: ["no"]` in `"extend"` mode            | throws `RangeError`              |
| `lenient: 1`, `locale: 1`                           | throws `TypeError`               |
