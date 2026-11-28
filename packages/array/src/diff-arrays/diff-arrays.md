# `diffArrays`

Returns the multiset difference of two arrays. One match consumes one occurrence.

`removed` holds items of `first` that were not matched in `second`. `added` holds items of `second` that were not matched in `first`. Both lists keep appearance order.

## Import

```ts
import { diffArrays } from "@sgx4u/array";
```

## Signature

```ts
function diffArrays<Item>(
    params: DiffArraysParams<Item>,
): ArrayMultisetDiff<Item> | undefined;
```

`ArrayMultisetDiff` is `{ added, removed }`.

## Parameters

| Name     | Description                                   |
| -------- | --------------------------------------------- |
| `first`  | The previous array.                           |
| `second` | The next array.                               |
| `equals` | Optional comparer. Defaults to SameValueZero. |

## Examples

```ts
diffArrays({ first: [1, 1, 2], second: [1, 3] });
// { removed: [1, 2], added: [3] }
```

## Edge cases

| Input                       | Result                       |
| --------------------------- | ---------------------------- |
| Either side is not an array | `undefined`                  |
| Both sides are empty        | `{ added: [], removed: [] }` |
| `NaN`                       | `NaN` matches `NaN`          |
| `equals` is not a function  | Throws `TypeError`           |
| A sparse hole               | The hole is `undefined`      |

`added` and `removed` are new arrays. The inputs are not mutated.
