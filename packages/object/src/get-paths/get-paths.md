# `getPaths`

Reads one value for each path, in order. A missing path, an illegal path, and a sparse hole use `defaultValue`, or `undefined` when that argument is omitted. An empty path reads `object`. A present value of `undefined` stays `undefined`. The input is not mutated.

Dangerous keys are skipped. One bad path does not reject the other paths. The whole call returns `undefined` when `object` is not object-like or `paths` is not an array.

## Import

```ts
import { getPaths } from "@sgx4u/object";
```

## Signature

```ts
function getPaths(params: GetPathsParams): unknown[] | undefined;
```

## Options

| Option          | Type                        | Default     | Description                                                        |
| --------------- | --------------------------- | ----------- | ------------------------------------------------------------------ |
| `object`        | `unknown`                   |             | Value to read. A non-object returns `undefined`.                   |
| `paths`         | `readonly ObjectPath[]`     |             | Paths to read. A non-array returns `undefined`.                    |
| `defaultValue`  | `unknown`                   | `undefined` | Used for a path that cannot be read.                               |
| `pathStyle`     | `"dot"` or `"json-pointer"` | `"dot"`     | How a string path is parsed. An unknown value raises `RangeError`. |
| `pathDelimiter` | `string`                    | `"."`       | Separator for a dot path. An empty string raises `RangeError`.     |

## Example

```ts
getPaths({ object: { a: 1, b: 2 }, paths: ["a", "c"], defaultValue: 0 });
// [1, 0]
```

## Edge cases

| Case                                       | Result                                                           |
| ------------------------------------------ | ---------------------------------------------------------------- |
| An empty path in the list                  | That slot is `object`.                                           |
| A sparse hole                              | `defaultValue`. Neighboring indexes are still read.              |
| An illegal path beside a valid path        | The illegal slot is `defaultValue`. The valid slot is the value. |
| `__proto__.polluted`                       | `defaultValue`. `Object.prototype` is unchanged.                 |
| `paths` is empty                           | An empty array.                                                  |
| `object` is `null`, or `paths` is a string | `undefined`.                                                     |
