# `omitPaths`

Returns a copy of `object` with the given paths removed. The walk copies only ancestors of a removed path. When nothing is removed, the same object is returned. The input is not mutated, and untouched values keep their references.

A plain object that becomes empty is removed from its parent, and that rule repeats. The root may be `{}`. An empty array is kept. This is a dedicated walk, not `unsetPath`: empty parents disappear.

When an array index is removed, or a plain-object element becomes empty, the index is spliced out and later items shift. A hole that is not the removed index is preserved.

## Import

```ts
import { omitPaths } from "@sgx4u/object";
```

## Signature

```ts
function omitPaths(params: OmitPathsParams): unknown;
```

## Options

| Option          | Type                        | Default | Description                                                          |
| --------------- | --------------------------- | ------- | -------------------------------------------------------------------- |
| `object`        | `unknown`                   |         | Value to copy. `null`, primitives, and functions return `undefined`. |
| `paths`         | `readonly ObjectPath[]`     |         | Paths to remove. A non-array returns `undefined`.                    |
| `pathStyle`     | `"dot"` or `"json-pointer"` | `"dot"` | How a string path is parsed. An unknown value raises `RangeError`.   |
| `pathDelimiter` | `string`                    | `"."`   | Separator for a dot path. An empty string raises `RangeError`.       |

## Example

```ts
omitPaths({ object: { a: { b: 1 }, c: 2 }, paths: ["a.b"] });
// { c: 2 }
```

## Edge cases

| Case                                     | Result                                                                            |
| ---------------------------------------- | --------------------------------------------------------------------------------- |
| `{ a: { b: { c: 1 } } }` without `a.b.c` | `{}`. Each emptied plain object is dropped.                                       |
| `{ a: { b: 1, c: 2 } }` without `a.b`    | `{ a: { c: 2 } }`.                                                                |
| An empty path or an illegal path         | Ignored. If every path is ignored, the same object is returned.                   |
| An index past the end of an array        | The array is unchanged.                                                           |
| A class instance that changes            | The copy is a plain object. Maps, sets, and binary values are not descended into. |
| An own `__proto__` key that remains      | Written with `Object.defineProperty`. `Object.prototype` is unchanged.            |
| A dot path such as `[0]`                 | Illegal with the current reader. Use `0`, `"0"`, or a JSON Pointer.               |
