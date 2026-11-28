# `createBoolean`

Returns every function in this package with the given defaults bound in. A value on a single call replaces the stored one. Two instances do not share arrays or option objects. Nothing is written to module state or `globalThis`. The package functions keep their own defaults. `createBoolean` is not copied onto the instance.

Validation runs at creation. A bad option or an overlapping word throws before the instance is returned.

## Import

```ts
import { createBoolean } from "@sgx4u/boolean";
```

## Signature

```ts
function createBoolean<Config extends BooleanConfig = BooleanConfig>(
    config?: Config,
): BooleanInstance<Config>;
```

## Options

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

The word lists are copied. Mutating the caller's array later does not change the instance. A field set to `undefined` on one call is treated as omitted, so the stored default stays. `isParseableBoolean` does not use `fallback`. `getBooleanWords` uses `locale` when a call omits it. `formatBoolean` uses `locale`, `formatStyle`, and `formatCapitalization`. Logic functions and predicate combinators are present and ignore the config.

When `fallback` is set on the config, `instance.parseBoolean(value)` is typed as `boolean`.

## Examples

```ts
const french = createBoolean({
    locale: "fr",
    formatStyle: "yes-no",
    formatCapitalization: "sentence",
});

french.parseBoolean("oui"); // true
french.formatBoolean({ value: true }); // "Oui"
parseBoolean("oui"); // undefined
```

## Edge cases

| Call                                     | Result                                                          |
| ---------------------------------------- | --------------------------------------------------------------- |
| `createBoolean({ truthyWords: ["no"] })` | throws `RangeError` at creation                                 |
| `createBoolean({ lenient: "yes" })`      | throws `TypeError` at creation                                  |
| `createBoolean(null)`                    | throws `TypeError`                                              |
| Two instances with different locales     | neither sees the other's words                                  |
| A later `createBoolean(...)`             | does not change an existing instance or the root `parseBoolean` |
