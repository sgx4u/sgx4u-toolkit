# `unsetPath`

Returns a copy of `object` with `path` removed. A missing path returns the same object. The input is not mutated. Empty parent objects stay in place. Use `omitPaths` when those parents should disappear.

When the parent is an array and the last segment is an index, that index is spliced out and later items shift left. A hole is spliced the same way. An index past the end leaves the array unchanged.

## Import

```ts
import { unsetPath } from "@sgx4u/object";
```

## Signature

```ts
function unsetPath(params: UnsetPathParams): unknown;
```

## Options

| Option          | Type                             | Default  | Description                                                                                                |
| --------------- | -------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| `object`        | `unknown`                        |          | Object to copy. `null`, primitives, and functions return `undefined`.                                      |
| `path`          | `ObjectPath`                     |          | Path to remove. An illegal path returns `undefined`.                                                       |
| `pathStyle`     | `"dot"` or `"json-pointer"`      | `"dot"`  | How a string path is parsed. An unknown value raises `RangeError`.                                         |
| `pathDelimiter` | `string`                         | `"."`    | Separator for a dot path. An empty string raises `RangeError`.                                             |
| `prototypeKeys` | `"skip"`, `"throw"`, or `"keep"` | `"skip"` | How dangerous keys are treated. `"throw"` raises `RangeError`. `"skip"` leaves the dangerous key in place. |

## Example

```ts
unsetPath({ object: { a: { b: 1, c: 2 } }, path: "a.b" });
// { a: { c: 2 } }
```

## Edge cases

| Case                                                        | Result                                                                |
| ----------------------------------------------------------- | --------------------------------------------------------------------- |
| The path is missing                                         | The same object.                                                      |
| An empty path                                               | The same object. The root is not removed.                             |
| `[1, 2, 3]` without index `0`                               | `[2, 3]`. The input array is unchanged.                               |
| A sparse hole at the removed index                          | Spliced. Later items shift, and the hole does not become `undefined`. |
| An index past the end                                       | The same array.                                                       |
| A path such as `__proto__.polluted` with the default policy | The same object. `Object.prototype` is unchanged.                     |
| A dot path such as `[0]`                                    | `undefined`, because the current reader rejects it. Use `0` or `"0"`. |
