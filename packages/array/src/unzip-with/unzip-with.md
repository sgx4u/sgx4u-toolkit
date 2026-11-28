# `unzipWith`

Turns rows into columns, then calls `combine(...columnItems)` for each column. The input is not mutated.

A shorter row contributes `undefined` for each missing cell. A slot that is not an array counts as an empty row.

## Import

```ts
import { unzipWith } from "@sgx4u/array";
```

## Signature

```ts
function unzipWith<Result>(
    params: UnzipWithParams<Result>,
): Result[] | undefined;
```

## Parameters

| Name      | Type                         | Description                             |
| --------- | ---------------------------- | --------------------------------------- |
| `array`   | `readonly unknown[]`         | Rows. A non-array slot is an empty row. |
| `combine` | `(...columnItems) => Result` | Called once per column.                 |

## Examples

```ts
unzipWith({
    array: [
        [1, 2],
        [3, 4],
    ],
    combine: (left, right) => Number(left) + Number(right),
}); // [4, 6]

unzipWith({
    array: [[1, 2], [3]],
    combine: (...column) => column,
}); // [[1, 3], [2, undefined]]
```

## Edge cases

- `null`, a string, or another non-object returns `undefined`.
- A non-array `array` returns `undefined` when `combine` is a function. That includes `{}`, a typed array, a `Set`, and a generator passed as `array`.
- `combine` that is missing or not a function throws `TypeError` before `array` is read.
- An empty list, or rows with no cells, returns `[]` and does not call `combine`.
- A hole is passed as `undefined`.
- The input is not mutated.
