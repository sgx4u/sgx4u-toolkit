# `getPairs`

Returns every unordered pair, in lexicographic index order. This is the combinations of size 2. The number of pairs in `n` items is `n * (n - 1) / 2`.

## Import

```ts
import { getPairs } from "@sgx4u/array/combinatorics";
```

## Signature

```ts
function getPairs<Item>(array: readonly Item[]): Array<[Item, Item]>;
```

A value that is not an array returns `undefined`.

## Parameters

| Name    | Description                                                   |
| ------- | ------------------------------------------------------------- |
| `array` | The source array. Pass the array itself, not a params object. |

## Examples

```ts
getPairs([1, 2, 3]); // [[1, 2], [1, 3], [2, 3]]
getPairs([1]); // []
```

## Edge cases

| Input                | Result      |
| -------------------- | ----------- |
| Fewer than two items | `[]`        |
| A non-array          | `undefined` |

Each pair is a new tuple. The input is not mutated.
