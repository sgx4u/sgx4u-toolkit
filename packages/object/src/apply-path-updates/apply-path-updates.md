# `applyPathUpdates`

Applies path writes from left to right and returns the new object. Each write uses `setPathSegments`. A later write sees the earlier results. When no write changes the value, the same object is returned. The input and `updates` are not mutated.

`updates` may be a plain object whose keys are path strings, or an array of `{ path, value }` entries. Any other value returns `undefined`. `null`, primitives, and functions return `undefined` for `object`.

## Import

```ts
import { applyPathUpdates } from "@sgx4u/object";
```

## Signature

```ts
function applyPathUpdates(params: ApplyPathUpdatesParams): unknown;
```

## Options

| Option          | Type                                                 | Default  | Description                                                        |
| --------------- | ---------------------------------------------------- | -------- | ------------------------------------------------------------------ |
| `object`        | `unknown`                                            |          | Object to copy. A non-object returns `undefined`.                  |
| `updates`       | `Record<string, unknown>` or `readonly PathUpdate[]` |          | Writes, left to right. A plain object's keys are path text.        |
| `pathStyle`     | `"dot"` or `"json-pointer"`                          | `"dot"`  | How a string path is parsed. An unknown value raises `RangeError`. |
| `pathDelimiter` | `string`                                             | `"."`    | Separator for a dot path. An empty string raises `RangeError`.     |
| `prototypeKeys` | `"skip"`, `"throw"`, or `"keep"`                     | `"skip"` | How dangerous keys are written.                                    |

`PathUpdate` is `{ path: ObjectPath; value: unknown }`.

## Example

```ts
applyPathUpdates({ object: { a: 1 }, updates: { "b.c": 2 } });
// { a: 1, b: { c: 2 } }
```

## Edge cases

| Case                                                                                           | Result                                                                                 |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `updates` is `{}` or `[]`                                                                      | The same object.                                                                       |
| A later path writes over an earlier one                                                        | The later value remains. `{ "a.b": 2, a: 1 }` leaves `{ a: 1 }`.                       |
| An empty path                                                                                  | Replaces the current root with that update's value.                                    |
| An illegal path, or an array entry without `path`                                              | Skipped. Other updates still run.                                                      |
| A sparse hole                                                                                  | Filled when the path is an index such as `"1"`. The input hole stays a hole.           |
| `"__proto__.polluted": true` with the default policy                                           | Not written. `Object.prototype` is unchanged.                                          |
| `prototypeKeys: "throw"` on that path                                                          | `RangeError`. The input is unchanged.                                                  |
| `updates` is a `Map`, `null`, or an array that is not a list of updates and not a plain object | `undefined`. An array of malformed entries is still an array: bad entries are skipped. |
