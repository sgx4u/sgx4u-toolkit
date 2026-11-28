# `setPath`

Returns a copy of `object` with `value` stored at `path`. Ancestors on the path are copied. Unchanged subtrees keep their references. When the stored value is already present, the same object is returned. The input is not mutated.

A missing parent is created. A following index creates an array, and any other segment creates a plain object. Arrays are objects and can be edited. `null`, primitives, and functions return `undefined`.

## Import

```ts
import { setPath } from "@sgx4u/object";
```

## Signature

```ts
function setPath(params: SetPathParams): unknown;
```

## Options

| Option          | Type                             | Default  | Description                                                        |
| --------------- | -------------------------------- | -------- | ------------------------------------------------------------------ |
| `object`        | `unknown`                        |          | Object to copy. A non-object returns `undefined`.                  |
| `path`          | `ObjectPath`                     |          | Where to store `value`. An illegal path returns `undefined`.       |
| `value`         | `unknown`                        |          | Value to store. It is not cloned.                                  |
| `pathStyle`     | `"dot"` or `"json-pointer"`      | `"dot"`  | How a string path is parsed. An unknown value raises `RangeError`. |
| `pathDelimiter` | `string`                         | `"."`    | Separator for a dot path. An empty string raises `RangeError`.     |
| `prototypeKeys` | `"skip"`, `"throw"`, or `"keep"` | `"skip"` | How dangerous keys are written.                                    |

## Example

```ts
setPath({ object: { a: { b: 1 } }, path: "a.c", value: 2 });
// { a: { b: 1, c: 2 } }
```

## Edge cases

| Case                                     | Result                                                                                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| The value at the path is already `value` | The same object.                                                                                                                           |
| An empty path                            | Replaces the root. The replacement is returned even when it is not an object. The same root is returned when the replacement is that root. |
| A sparse hole                            | Filled. Other holes stay holes.                                                                                                            |
| `prototypeKeys: "skip"`                  | The dangerous key is not written. A copy of an ancestor can also drop an existing dangerous own key. `Object.prototype` is unchanged.      |
| `prototypeKeys: "keep"`                  | An own data property is defined. `Object.prototype` is unchanged.                                                                          |
| `prototypeKeys: "throw"`                 | `RangeError`. Nothing is written on the input.                                                                                             |
| A dot path such as `a[0].b`              | `undefined`. The current reader rejects it. Use `a.0.b`, a segment array, or a JSON Pointer.                                               |
