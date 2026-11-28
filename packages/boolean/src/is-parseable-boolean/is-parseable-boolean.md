# `isParseableBoolean`

Reports whether [`parseBoolean`](../parse-boolean/parse-boolean.md) would return `true` or `false` for the same value and options, ignoring `fallback`. An unrecognized value returns `false`, never `undefined`.

Pass the value alone, or one object that owns `value`. Do not pass `(value, options)`.

## Import

```ts
import { isParseableBoolean } from "@sgx4u/boolean";
```

## Signature

```ts
function isParseableBoolean(value: unknown): boolean;
function isParseableBoolean(input: IsParseableBooleanInput): boolean;
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

`fallback` is not an option. If a caller puts it on the object, it is checked and then ignored.

## Examples

```ts
isParseableBoolean(" YES "); // true
isParseableBoolean("maybe"); // false
isParseableBoolean({ value: "oui", locale: "fr" }); // true
```

## Edge cases

| Value                                             | Result              |
| ------------------------------------------------- | ------------------- |
| `true`, `false`, `0`, `1`, `-0`                   | `true`              |
| `"maybe"`, `2`, `""`, `null`, `new Boolean(true)` | `false`             |
| Overlapping word lists                            | throws `RangeError` |
| `lenient: 1`                                      | throws `TypeError`  |
