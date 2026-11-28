# `pickPaths`

Rebuilds a value that contains only the given paths. Each path is read with `readPathSegments` and written with `setPathSegments`, from left to right. Missing paths are left out. The input is not mutated. Leaf values keep their references.

An array is rebuilt as an array. Any other object is rebuilt as a plain object. A null-prototype source produces a null-prototype result.

## Import

```ts
import { pickPaths } from "@sgx4u/object";
```

## Signature

```ts
function pickPaths(params: PickPathsParams): unknown;
```

## Options

| Option          | Type                        | Default | Description                                                             |
| --------------- | --------------------------- | ------- | ----------------------------------------------------------------------- |
| `object`        | `unknown`                   |         | Value to project. `null`, primitives, and functions return `undefined`. |
| `paths`         | `readonly ObjectPath[]`     |         | Paths to copy. A non-array returns `undefined`.                         |
| `pathStyle`     | `"dot"` or `"json-pointer"` | `"dot"` | How a string path is parsed. An unknown value raises `RangeError`.      |
| `pathDelimiter` | `string`                    | `"."`   | Separator for a dot path. An empty string raises `RangeError`.          |

## Example

```ts
pickPaths({ object: { a: { b: 1, c: 2 }, d: 3 }, paths: ["a.b", "d"] });
// { a: { b: 1 }, d: 3 }
```

## Edge cases

| Case                                       | Result                                                                                |
| ------------------------------------------ | ------------------------------------------------------------------------------------- |
| A missing, empty, or illegal path          | Omitted. If nothing is copied, the result is a new empty object or a new empty array. |
| Two paths write the same location          | The later path wins.                                                                  |
| A sparse hole                              | Not copied. Other indexes stay holes until a selected index fills them.               |
| `__proto__`, `prototype`, or `constructor` | Skipped. `Object.prototype` is unchanged.                                             |
| A dot path such as `a[0].b`                | Illegal with the current reader. Use `a.0.b`, a segment array, or a JSON Pointer.     |
