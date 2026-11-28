# `isDisjoint`

Reports whether two arrays share no item. Empty arrays are disjoint. `[NaN]` and `[NaN]` are not disjoint, because `NaN` matches `NaN`. The function never throws.

## Import

```ts
import { isDisjoint, type IsDisjointParams } from "@sgx4u/array";
```

## Signature

```ts
function isDisjoint<Item>(params: IsDisjointParams<Item>): boolean;
```

## Parameters

| Name     | Type              | Default       | Description                                |
| -------- | ----------------- | ------------- | ------------------------------------------ |
| `first`  | `readonly Item[]` |               | The first array.                           |
| `second` | `readonly Item[]` |               | The second array.                          |
| `equals` | `Equals<Item>`    | SameValueZero | An invalid value makes the result `false`. |

## Examples

```ts
isDisjoint({ first: [1, 2], second: [3, 4] });
// true
```

## Edge cases

- `null`, `{}`, a string, a `Uint8Array`, a `Set`, and a generator return `false`.
- Either side not being an array returns `false`. A non-function `equals` returns `false`.
- `-0` and `0` count as the same item. Holes are `undefined`.
- The inputs are not mutated.
