# Function reference

Every export of `@sgx4u/boolean`. Guides for each function are linked from the [package README](./README.md).

A function that takes one value takes it directly. A function that takes several named values takes one flat object. `parseBoolean` and `isParseableBoolean` accept either the value or one object that owns `value`.

## Checks and parsing

| Function             | Parameters                                                                                                                                                                                                                                                    | Returns                | Description                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------- |
| `isBoolean`          | `value: unknown`                                                                                                                                                                                                                                              | `value is boolean`     | `true` when `value` is a primitive boolean.                               |
| `isTruthy`           | `value: unknown`                                                                                                                                                                                                                                              | `boolean`              | `true` when JavaScript treats `value` as truthy.                          |
| `isFalsy`            | `value: unknown`                                                                                                                                                                                                                                              | `boolean`              | `true` when JavaScript treats `value` as falsy.                           |
| `isParseableBoolean` | `value: unknown`                                                                                                                                                                                                                                              | `boolean`              | `true` when the value is a recognized token, using default parse options. |
| `isParseableBoolean` | `{ value: unknown, locale?: string, truthyWords?: readonly string[], falsyWords?: readonly string[], wordListMode?: "extend" \| "replace" = "extend", caseSensitive?: boolean = false, trim?: boolean = true, lenient?: boolean = false }`                    | `boolean`              | Same check with explicit options. `fallback` is ignored.                  |
| `parseBoolean`       | `value: unknown`                                                                                                                                                                                                                                              | `boolean \| undefined` | The recognized boolean, or `undefined`.                                   |
| `parseBoolean`       | `{ value: unknown, locale?: string, truthyWords?: readonly string[], falsyWords?: readonly string[], wordListMode?: "extend" \| "replace" = "extend", caseSensitive?: boolean = false, trim?: boolean = true, lenient?: boolean = false, fallback: boolean }` | `boolean`              | The recognized boolean, or `fallback`.                                    |
| `parseBoolean`       | `{ value, locale?, truthyWords?, falsyWords?, wordListMode? = "extend", caseSensitive? = false, trim? = true, lenient? = false }`                                                                                                                             | `boolean \| undefined` | The recognized boolean, or `undefined` when `fallback` is omitted.        |
| `getBooleanWords`    | `{ locale?: string = "en", category?: "truthy" \| "falsy" \| "all" = "all" }` or no argument                                                                                                                                                                  | `BooleanWords`         | A new `{ truthy, falsy }` copy of the built-in vocabulary.                |
| `listBooleanLocales` | none                                                                                                                                                                                                                                                          | `string[]`             | Sorted language subtags, including `"en"`. A new array each call.         |

## Formatting

| Function        | Parameters                                                                                                                                | Returns               | Description                                     |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------------------- |
| `formatBoolean` | `{ value: unknown, style?: BooleanFormatStyle = "true-false", locale?: string = "en", capitalization?: BooleanCapitalization = "lower" }` | `string \| undefined` | A word for a primitive boolean, or `undefined`. |

`BooleanFormatStyle` is `"true-false" | "yes-no" | "on-off" | "enabled-disabled" | "y-n" | "t-f" | "1-0"`.

`BooleanCapitalization` is `"lower" | "sentence" | "upper"`.

## Logic

| Function         | Parameters                                     | Returns                | Description                                                   |
| ---------------- | ---------------------------------------------- | ---------------------- | ------------------------------------------------------------- |
| `not`            | `value: unknown`                               | `boolean \| undefined` | The opposite boolean, or `undefined`.                         |
| `toggle`         | `value: unknown`                               | `boolean \| undefined` | The same result as `not`.                                     |
| `all`            | `values: readonly unknown[]`                   | `boolean \| undefined` | Every entry is `true`. `[]` is `true`.                        |
| `any`            | `values: readonly unknown[]`                   | `boolean \| undefined` | Some entry is `true`. `[]` is `false`.                        |
| `none`           | `values: readonly unknown[]`                   | `boolean \| undefined` | No entry is `true`. `[]` is `true`.                           |
| `nand`           | `values: readonly unknown[]`                   | `boolean \| undefined` | Negation of `all`. `[]` is `false`.                           |
| `nor`            | `values: readonly unknown[]`                   | `boolean \| undefined` | Negation of `any`. `[]` is `true`.                            |
| `xor`            | `values: readonly unknown[]`                   | `boolean \| undefined` | An odd number of entries are `true`. `[]` is `false`.         |
| `xnor`           | `values: readonly unknown[]`                   | `boolean \| undefined` | An even number of entries are `true`. `[]` is `true`.         |
| `implies`        | `{ antecedent: unknown, consequent: unknown }` | `boolean \| undefined` | `!antecedent \|\| consequent`.                                |
| `exactlyOne`     | `values: readonly unknown[]`                   | `boolean \| undefined` | Precisely one entry is `true`. `[]` is `false`.               |
| `areEqual`       | `values: readonly unknown[]`                   | `boolean \| undefined` | Every entry is the same boolean. `[]` is `true`.              |
| `countTrue`      | `values: readonly unknown[]`                   | `number \| undefined`  | How many entries are `true`. `[]` is `0`.                     |
| `isMajorityTrue` | `values: readonly unknown[]`                   | `boolean \| undefined` | `true` strictly outnumbers `false`. A tie or `[]` is `false`. |

A non-boolean entry makes a logic function return `undefined`. A non-array `values` throws `TypeError`.

## Predicates

`Predicate<Value>` is `(value: Value) => boolean`.

| Function         | Parameters                                                       | Returns            | Description                                                                                      |
| ---------------- | ---------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------ |
| `allPass`        | `predicates: readonly Predicate<Value>[]`                        | `Predicate<Value>` | Every predicate is true. `[]` is always `true`.                                                  |
| `anyPass`        | `predicates: readonly Predicate<Value>[]`                        | `Predicate<Value>` | Any predicate is true. `[]` is always `false`.                                                   |
| `nonePass`       | `predicates: readonly Predicate<Value>[]`                        | `Predicate<Value>` | No predicate is true. `[]` is always `true`.                                                     |
| `negate`         | `predicate: Predicate<Value>`                                    | `Predicate<Value>` | The opposite of `predicate`.                                                                     |
| `exactlyOnePass` | `predicates: readonly Predicate<Value>[]`                        | `Predicate<Value>` | Exactly one predicate is true. `[]` is always `false`.                                           |
| `impliesPass`    | `{ antecedent: Predicate<Value>, consequent: Predicate<Value> }` | `Predicate<Value>` | `!antecedent(value) \|\| consequent(value)`. `consequent` is skipped when `antecedent` is false. |

A non-function entry throws `TypeError` when the combinator is built.

## `createBoolean`

```ts
function createBoolean(config?: BooleanConfig): BooleanInstance<BooleanConfig>;
```

| Option                 | Type                    | Default                                     |
| ---------------------- | ----------------------- | ------------------------------------------- |
| `locale`               | `string`                | `"en"`                                      |
| `truthyWords`          | `readonly string[]`     | `[]`                                        |
| `falsyWords`           | `readonly string[]`     | `[]`                                        |
| `wordListMode`         | `"extend" \| "replace"` | `"extend"`                                  |
| `caseSensitive`        | `boolean`               | `false`                                     |
| `trim`                 | `boolean`               | `true`                                      |
| `lenient`              | `boolean`               | `false`                                     |
| `fallback`             | `boolean`               | omitted. `parseBoolean` returns `undefined` |
| `formatStyle`          | `BooleanFormatStyle`    | `"true-false"`                              |
| `formatCapitalization` | `BooleanCapitalization` | `"lower"`                                   |

A config that sets `fallback` types `instance.parseBoolean(value)` as `boolean`. A call can still set its own `fallback`.

### Instance API

`BooleanInstance` has the same functions except `createBoolean`.

| Method                                                                                                                             | Bound defaults                                                                                        | Per-call override                       |
| ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `parseBoolean`                                                                                                                     | `locale`, `truthyWords`, `falsyWords`, `wordListMode`, `caseSensitive`, `trim`, `lenient`, `fallback` | Any of those fields                     |
| `isParseableBoolean`                                                                                                               | The same parse fields except `fallback`                                                               | Any parse field. `fallback` is not used |
| `formatBoolean`                                                                                                                    | `locale`, `formatStyle` as `style`, `formatCapitalization` as `capitalization`                        | `locale`, `style`, `capitalization`     |
| `getBooleanWords`                                                                                                                  | `locale`                                                                                              | `locale`, `category`                    |
| `isBoolean`, `isTruthy`, `isFalsy`, `listBooleanLocales`, `not`, `toggle`, the list logic functions, and the predicate combinators | none                                                                                                  | none. They are the package functions    |

Word arrays are copied at creation. Two instances do not share them. The package `parseBoolean` is not affected by any instance.
