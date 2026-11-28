# `transpose`

Turns rows into columns and returns a new matrix. The input is not mutated.

The result has one column per cell of the longest row. A shorter row is padded with `undefined`. A slot that is not an array counts as an empty row. Pass the matrix itself, not a params object.

## Import

```ts
import { transpose } from "@sgx4u/array";
```

## Signature

```ts
function transpose(matrix: readonly unknown[]): unknown[][];
```

A non-array argument returns `undefined`.

## Parameters

| Name     | Type                 | Description                        |
| -------- | -------------------- | ---------------------------------- |
| `matrix` | `readonly unknown[]` | Rows. Each row should be an array. |

## Examples

```ts
transpose([
    [1, 2, 3],
    [4, 5, 6],
]); // [[1, 4], [2, 5], [3, 6]]

transpose([[1, 2], [3]]); // [[1, 3], [2, undefined]]
transpose([]); // []
```

## Edge cases

- `null`, `{}`, a string, a typed array, a `Set`, or a generator returns `undefined`.
- An empty matrix returns a new `[]`.
- A non-array row is an empty row. It does not throw.
- A hole becomes `undefined`.
- The input is not mutated. Each column is a new array.
