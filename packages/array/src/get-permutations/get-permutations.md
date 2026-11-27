# `getPermutations`

Returns ordered permutations in lexicographic index order. Arrangements are by index, so duplicate values can produce duplicate permutations.

Permutations of `n` items are `n!`. A prefix of length `size` has `n! / (n - size)!` permutations. This function does not throw when `n` is large; it builds every permutation. Callers should keep `n` small.

## Import

```ts
import { getPermutations } from "@sgx4u/array/combinatorics";
```

## Signature

```ts
function getPermutations<Item>(
    params: GetPermutationsParams<Item>,
): Item[][] | undefined;
```

## Parameters

| Name    | Description                                                           |
| ------- | --------------------------------------------------------------------- |
| `array` | Items to arrange.                                                     |
| `size`  | How many items are in each permutation. Defaults to the array length. |

## Examples

```ts
getPermutations({ array: [1, 2, 3] });
// [1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]

getPermutations({ array: [1, 2, 3], size: 0 }); // [[]]
```

## Edge cases

| Input                                                     | Result                                                  |
| --------------------------------------------------------- | ------------------------------------------------------- |
| `size` is omitted                                         | Permutations of the full length. There are `n!` of them |
| `size` is `0`                                             | `[[]]`                                                  |
| `size` is greater than the length                         | `[]`                                                    |
| `array` is not an array                                   | `undefined`                                             |
| Duplicate values                                          | Permuted by index, so the same values can repeat        |
| `size` is not a finite integer greater than or equal to 0 | Throws `TypeError` or `RangeError`                      |

The input is not mutated. Each permutation is a new array.
