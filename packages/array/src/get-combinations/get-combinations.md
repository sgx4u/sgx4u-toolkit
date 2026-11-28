# `getCombinations`

Returns combinations in lexicographic index order. Each combination is a new array of items taken by increasing index.

The number of combinations of `n` items taken `size` at a time is `n! / (size! * (n - size)!)`. This function does not throw when that number is large; it builds every combination.

## Import

```ts
import { getCombinations } from "@sgx4u/array/combinatorics";
```

## Signature

```ts
function getCombinations<Item>(
    params: GetCombinationsParams<Item>,
): Item[][] | undefined;
```

## Parameters

| Name    | Description                                                                          |
| ------- | ------------------------------------------------------------------------------------ |
| `array` | Items to choose from.                                                                |
| `size`  | How many items are in each combination. A finite integer greater than or equal to 0. |

## Examples

```ts
getCombinations({ array: [1, 2, 3], size: 2 });
// [[1, 2], [1, 3], [2, 3]]

getCombinations({ array: [1, 2, 3], size: 0 }); // [[]]
```

## Edge cases

| Input                                         | Result                  |
| --------------------------------------------- | ----------------------- |
| `size` is `0`                                 | `[[]]`                  |
| `size` is greater than the length             | `[]`                    |
| `array` is not an array                       | `undefined`             |
| `size` is negative, fractional, or not finite | Throws `RangeError`     |
| `size` is not a number                        | Throws `TypeError`      |
| Duplicate values at different indexes         | Both indexes can appear |

The input is not mutated.
