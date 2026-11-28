# `isSubset`

Reports whether every item of `array` appears in `of`. An empty array is a subset of any array, including an empty one. Multiplicity is ignored, so `[1, 1]` is a subset of `[1]`. The function never throws.

## Import

```ts
import { isSubset, type IsSubsetParams } from "@sgx4u/array";
```

## Signature

```ts
function isSubset<Item>(params: IsSubsetParams<Item>): boolean;
```

## Parameters

| Name     | Type              | Default       | Description                                |
| -------- | ----------------- | ------------- | ------------------------------------------ |
| `array`  | `readonly Item[]` |               | Items that must all appear in `of`.        |
| `of`     | `readonly Item[]` |               | The candidate superset.                    |
| `equals` | `Equals<Item>`    | SameValueZero | An invalid value makes the result `false`. |

## Examples

```ts
isSubset({ array: [1, 1], of: [1, 2] });
// true
```

## Edge cases

- `null`, `{}`, a string, a `Uint8Array`, a `Set`, and a generator return `false`.
- Either side not being an array returns `false`. A non-function `equals` returns `false`.
- `NaN` matches `NaN`, and `-0` matches `0`. Holes are `undefined`.
- The inputs are not mutated.
