# `updatePath`

Reads the value at `path` and writes `updater(current)`. A missing path passes `undefined`. The write follows `setPath`: ancestors are copied, an unchanged value returns the same object, and the input is not mutated.

The updater is not called when `object` is not object-like or the path text is illegal. Those calls return `undefined`.

## Import

```ts
import { updatePath } from "@sgx4u/object";
```

## Signature

```ts
function updatePath(params: UpdatePathParams): unknown;
```

## Options

| Option          | Type                             | Default  | Description                                                                                                          |
| --------------- | -------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| `object`        | `unknown`                        |          | Object to copy. A non-object returns `undefined`.                                                                    |
| `path`          | `ObjectPath`                     |          | Path to read and write. An illegal path returns `undefined`.                                                         |
| `updater`       | `(current: unknown) => unknown`  |          | Receives the current value, or `undefined` when the path is missing.                                                 |
| `pathStyle`     | `"dot"` or `"json-pointer"`      | `"dot"`  | How a string path is parsed. An unknown value raises `RangeError`.                                                   |
| `pathDelimiter` | `string`                         | `"."`    | Separator for a dot path. An empty string raises `RangeError`.                                                       |
| `prototypeKeys` | `"skip"`, `"throw"`, or `"keep"` | `"skip"` | How dangerous keys are written. The read treats `"throw"` as `"skip"`, then the write raises if the key is rejected. |

## Example

```ts
updatePath({
    object: { count: 1 },
    path: "count",
    updater: (value) => Number(value) + 1,
});
// { count: 2 }
```

## Edge cases

| Case                                         | Result                                                                                                     |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| The updater returns the current value        | The same object.                                                                                           |
| The path is missing                          | `updater(undefined)` is called, and the returned value is stored.                                          |
| A sparse hole                                | The updater receives `undefined`, then the hole is filled.                                                 |
| `updater` is not a function                  | `TypeError`, before the options are checked.                                                               |
| `prototypeKeys: "throw"` on a dangerous path | The updater runs, then `RangeError` is raised. The input is unchanged and `Object.prototype` is unchanged. |
| A dot path such as `[1]`                     | `undefined`. The updater is not called. Use the index `1`.                                                 |
