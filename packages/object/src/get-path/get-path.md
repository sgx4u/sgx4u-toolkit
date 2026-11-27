# `getPath`

Reads the value at `path`. An empty path returns `object` itself. A missing path, a sparse array hole, and an illegal path return `defaultValue`, or `undefined` when that argument is omitted. A present value of `undefined` does not select the default. The input is not mutated.

A literal path on a typed object is typed as `PathValue` united with the default. A wide string resolves to `unknown`. A bracket string such as `"a[0].b"` stays wide because `PathValue` matches a dot before a bracket.

## Import

```ts
import { getPath } from "@sgx4u/object";
```

## Signature

```ts
function getPath<
    ObjectType,
    const Path extends ObjectPath,
    const DefaultValue = undefined,
>(
    params: GetPathParams<ObjectType, Path, DefaultValue>,
): GetPathResult<ObjectType, Path, DefaultValue>;
```

## Options

| Option          | Type                             | Default     | Description                                                                                                          |
| --------------- | -------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------- |
| `object`        | `unknown`                        |             | Value to read. An empty path returns it, including `null` and primitives.                                            |
| `path`          | `ObjectPath`                     |             | Dot path, JSON Pointer, number, or segment array.                                                                    |
| `defaultValue`  | `unknown`                        | `undefined` | Used when the path is missing or illegal.                                                                            |
| `pathStyle`     | `"dot"` or `"json-pointer"`      | `"dot"`     | How a string path is parsed. An unknown value raises `RangeError`.                                                   |
| `pathDelimiter` | `string`                         | `"."`       | Separator for a dot path. An empty string raises `RangeError`.                                                       |
| `prototypeKeys` | `"skip"`, `"throw"`, or `"keep"` | `"skip"`    | How dangerous keys are read. `"throw"` is read as `"skip"` and does not raise. An unknown value raises `RangeError`. |

## Example

```ts
getPath({ object: { id: 1 }, path: "id", defaultValue: 0 });
// 1
```

## Edge cases

| Case                                  | Result                                                                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `path` is `""`                        | The object itself, even when it is `null` or a primitive.                                                     |
| A property whose value is `undefined` | `undefined`, not `defaultValue`.                                                                              |
| A sparse hole                         | `defaultValue`.                                                                                               |
| `prototypeKeys: "keep"`               | An own dangerous data property can be read. An inherited one cannot.                                          |
| `prototypeKeys: "throw"`              | Does not throw. The key is skipped.                                                                           |
| A path such as `__proto__.polluted`   | Missing under the default policy. `Object.prototype` is unchanged.                                            |
| A dot path such as `a[0].b`           | Illegal with the current reader, so the default is returned. Use `a.0.b`, a segment array, or a JSON Pointer. |
