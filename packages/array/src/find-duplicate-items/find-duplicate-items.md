# `findDuplicateItems`

Returns the first occurrence of each value that appears more than once, in the order those first occurrences appear. `[1, 2, 1, 3, 2]` returns `[1, 2]`. `by` wins over `equals`. The stored value is the original item.

## Import

```ts
import {
    findDuplicateItems,
    type FindDuplicateItemsParams,
} from "@sgx4u/array";
```

## Signature

```ts
function findDuplicateItems<Item>(
    params: FindDuplicateItemsParams<Item>,
): Item[] | undefined;
```

## Parameters

| Name     | Type              | Default       | Description                                         |
| -------- | ----------------- | ------------- | --------------------------------------------------- |
| `array`  | `readonly Item[]` |               | Items to scan from left to right.                   |
| `by`     | `Iteratee<Item>`  |               | When set, duplicates use SameValueZero on this key. |
| `equals` | `Equals<Item>`    | SameValueZero | Used only when `by` is omitted.                     |

## Examples

```ts
findDuplicateItems({ array: [1, 2, 1, 3, 2] });
// [1, 2]
```

## Edge cases

- A non-array returns `undefined`. An empty array, or an array with no duplicates, returns `[]`.
- An invalid `by`, or an invalid `equals` when `by` is omitted, throws `TypeError` before `array` is checked.
- `NaN` matches `NaN`, and `-0` matches `0`. Holes are `undefined`.
- The input is not mutated. The result is a new array.
