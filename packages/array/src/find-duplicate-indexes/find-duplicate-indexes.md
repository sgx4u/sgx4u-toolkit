# `findDuplicateIndexes`

Returns every index of each value that appears more than once, including the first index. The indexes are ascending. `[1, 2, 1, 3, 2]` returns `[0, 1, 2, 4]`. `by` wins over `equals`.

## Import

```ts
import {
    findDuplicateIndexes,
    type FindDuplicateIndexesParams,
} from "@sgx4u/array";
```

## Signature

```ts
function findDuplicateIndexes<Item>(
    params: FindDuplicateIndexesParams<Item>,
): number[] | undefined;
```

## Parameters

| Name     | Type              | Default       | Description                                         |
| -------- | ----------------- | ------------- | --------------------------------------------------- |
| `array`  | `readonly Item[]` |               | Items to scan from left to right.                   |
| `by`     | `Iteratee<Item>`  |               | When set, duplicates use SameValueZero on this key. |
| `equals` | `Equals<Item>`    | SameValueZero | Used only when `by` is omitted.                     |

## Examples

```ts
findDuplicateIndexes({ array: [1, 2, 1, 3, 2] });
// [0, 1, 2, 4]
```

## Edge cases

- A non-array returns `undefined`. An empty array, or an array with no duplicates, returns `[]`.
- An invalid `by`, or an invalid `equals` when `by` is omitted, throws `TypeError`.
- `NaN` matches `NaN`, and `-0` matches `0`. A repeated hole contributes its index.
- The input is not mutated. The result is a new array.
