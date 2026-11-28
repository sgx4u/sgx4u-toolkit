# `isPermutationOf`

Reports whether two arrays hold the same items with the same multiplicities, in any order. `[1, 2, 2]` is a permutation of `[2, 1, 2]` and is not a permutation of `[1, 2]`. `NaN` equals `NaN` by default. The function never throws.

## Import

```ts
import { isPermutationOf, type IsPermutationOfParams } from "@sgx4u/array";
```

## Signature

```ts
function isPermutationOf<Item>(params: IsPermutationOfParams<Item>): boolean;
```

## Parameters

| Name     | Type              | Default       | Description                                |
| -------- | ----------------- | ------------- | ------------------------------------------ |
| `array`  | `readonly Item[]` |               | Items to compare, in any order.            |
| `other`  | `readonly Item[]` |               | The other items. Multiplicity must match.  |
| `equals` | `Equals<Item>`    | SameValueZero | An invalid value makes the result `false`. |

## Examples

```ts
isPermutationOf({ array: [1, 2, 1], other: [1, 1, 2] });
// true
```

## Edge cases

- `null`, `{}`, a string, a `Uint8Array`, a `Set`, and a generator return `false`.
- Either side not being an array returns `false`. A non-function `equals` returns `false`.
- Different lengths return `false`. `-0` matches `0`. Holes are `undefined`.
- The inputs are not mutated. A custom `equals` compares against a copy of `other`.
