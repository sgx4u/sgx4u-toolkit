# `isEqual`

Reports whether two values have the same structure by calling `valuesAreEqual`. Property order does not matter. Array order and length do. The function does not throw.

Cycles are always tolerated. `circular` is ignored, including `"throw"` and any unknown value. A cycle is paired once, so the walk ends.

## Import

```ts
import { isEqual } from "@sgx4u/object";
```

## Signature

```ts
function isEqual(params: IsEqualParams): boolean;
```

## Options

| Option                 | Default | Meaning                                                                             |
| ---------------------- | ------- | ----------------------------------------------------------------------------------- |
| `first`, `second`      |         | The values to compare.                                                              |
| `includeSymbols`       | `false` | Compare enumerable symbol keys.                                                     |
| `includeNonEnumerable` | `false` | Compare non-enumerable string keys.                                                 |
| `circular`             | ignored | Present only so a caller can pass it. It never changes the result and never throws. |

## Example

```ts
isEqual({ first: { a: Number.NaN }, second: { a: Number.NaN } });
// true
```

## Edge cases

| Values                                              | Result                                                                   |
| --------------------------------------------------- | ------------------------------------------------------------------------ |
| `NaN` and `NaN`                                     | `true`                                                                   |
| `+0` and `-0`                                       | `true`                                                                   |
| Two invalid `Date`s                                 | `true`                                                                   |
| `[1, , 3]` and `[1, undefined, 3]`                  | `false`. A hole is not a stored `undefined`                              |
| Symbol keys                                         | Equal when `includeSymbols` is omitted, even if the symbol values differ |
| Different symbol values with `includeSymbols: true` | `false`                                                                  |
| A cycle, even with `circular: "throw"`              | Compared, and the call returns a boolean                                 |
| Argument is not an object                           | `false`                                                                  |
