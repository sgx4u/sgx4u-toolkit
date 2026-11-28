# `getPowerSet`

Returns every subset, from the empty subset through the full array. Subsets are ordered by increasing size, and within a size by lexicographic index order.

A power set of `n` items has `2^n` subsets. This function does not throw when `n` is large; it builds every subset.

## Import

```ts
import { getPowerSet } from "@sgx4u/array/combinatorics";
```

## Signature

```ts
function getPowerSet<Item>(array: readonly Item[]): Item[][];
```

A value that is not an array returns `undefined`.

## Parameters

| Name    | Description                                                   |
| ------- | ------------------------------------------------------------- |
| `array` | The source array. Pass the array itself, not a params object. |

## Examples

```ts
getPowerSet([1, 2]); // [[], [1], [2], [1, 2]]
getPowerSet([]); // [[]]
```

## Edge cases

| Input       | Result                                             |
| ----------- | -------------------------------------------------- |
| `[]`        | `[[]]`                                             |
| A non-array | `undefined`                                        |
| Two items   | The empty subset, each item alone, then both items |

Each subset is a new array. The input is not mutated.
