# `unzip`

Turns an array of tuples into columns. This is the inverse of `zip` when every row has the same length. The input is not mutated.

The result has one column per cell of the longest row. A slot that is not an array counts as an empty row. A shorter row contributes `undefined` for each missing cell.

## Import

```ts
import { unzip } from "@sgx4u/array";
```

## Signature

```ts
function unzip(array: readonly unknown[]): unknown[][];
```

A non-array argument returns `undefined`.

## Parameters

| Name    | Type                 | Description                                                                    |
| ------- | -------------------- | ------------------------------------------------------------------------------ |
| `array` | `readonly unknown[]` | Rows. Each row should be an array. Pass the array itself, not a params object. |

## Examples

```ts
unzip([
    [1, 2],
    [3, 4],
]); // [[1, 3], [2, 4]]

unzip([[1, 2], [3]]); // [[1, 3], [2, undefined]]

unzip(
    zip({
        arrays: [
            [1, 2, 3],
            [4, 5],
        ],
        mode: "shortest",
    }),
);
// [[1, 2], [4, 5]]
```

## Edge cases

- `null`, `{}`, a string, a typed array, a `Set`, or a generator returns `undefined`.
- An empty list returns a new `[]`.
- A non-array row is an empty row. It does not throw.
- A hole in a row becomes `undefined`.
- `unzip(zip({ arrays, mode: "shortest" }))` restores each input truncated to the shortest length when that length is greater than `0`.
- Zipping arrays whose shortest length is `0` produces no tuples, so `unzip` returns `[]` rather than a list of empty arrays.
- The input is not mutated. Each column is a new array.
