# `hasPath`

Reports whether `path` can be read. The function never throws. An unknown `pathStyle`, `prototypeKeys`, or `inherited`, or an empty `pathDelimiter`, returns `false`. The input is not mutated.

Own properties are required unless `inherited` is true. A sparse array hole is missing. Dangerous keys are missing unless `prototypeKeys` is `"keep"`, and even then only an own data property matches. `"throw"` is read as `"skip"`.

## Import

```ts
import { hasPath } from "@sgx4u/object";
```

## Signature

```ts
function hasPath(params: HasPathParams): boolean;
```

## Options

| Option          | Type                             | Default  | Description                                                                            |
| --------------- | -------------------------------- | -------- | -------------------------------------------------------------------------------------- |
| `object`        | `unknown`                        |          | Value to inspect.                                                                      |
| `path`          | `ObjectPath`                     |          | Path to test. An illegal path returns `false`.                                         |
| `inherited`     | `boolean`                        | `false`  | Count inherited properties for ordinary keys. Any other present value returns `false`. |
| `pathStyle`     | `"dot"` or `"json-pointer"`      | `"dot"`  | How a string path is parsed. An unknown value returns `false`.                         |
| `pathDelimiter` | `string`                         | `"."`    | Separator for a dot path. An empty string returns `false`.                             |
| `prototypeKeys` | `"skip"`, `"throw"`, or `"keep"` | `"skip"` | How dangerous keys are read. An unknown value returns `false`.                         |

## Example

```ts
hasPath({ object: { id: 1 }, path: "id" });
// true
```

## Edge cases

| Case                                             | Result                                                                                  |
| ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| An empty path                                    | `true`, including for `null` and primitives. The empty path addresses the value itself. |
| A sparse hole, with or without `inherited: true` | `false`.                                                                                |
| `toString` on a plain object                     | `false` unless `inherited` is true.                                                     |
| An own `__proto__` from `JSON.parse`             | `false` by default. `true` when `prototypeKeys` is `"keep"`.                            |
| `prototypeKeys: "throw"`                         | `false` for a dangerous path. It does not throw.                                        |
| A dot path such as `[0]`                         | `false`. The current reader rejects it. Use `0` or `"0"`.                               |
