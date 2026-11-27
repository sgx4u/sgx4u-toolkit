# `isSuperset`

Reports whether `array` contains every item of `of`. An empty `of` is contained by any array. Multiplicity is ignored. The function never throws.

## Import

```ts
import { isSuperset, type IsSupersetParams } from "@sgx4u/array";
```

## Signature

```ts
function isSuperset<Item>(params: IsSupersetParams<Item>): boolean;
```

## Parameters

| Name     | Type              | Default       | Description                                |
| -------- | ----------------- | ------------- | ------------------------------------------ |
| `array`  | `readonly Item[]` |               | The candidate superset.                    |
| `of`     | `readonly Item[]` |               | Items that must all appear in `array`.     |
| `equals` | `Equals<Item>`    | SameValueZero | An invalid value makes the result `false`. |

## Examples

```ts
isSuperset({ array: [1, 2, 2], of: [2, 1] });
// true
```

## Edge cases

- `null`, `{}`, a string, a `Uint8Array`, a `Set`, and a generator return `false`.
- Either side not being an array returns `false`. A non-function `equals` returns `false`.
- `NaN` matches `NaN`, and `-0` matches `0`. Holes are `undefined`.
- The inputs are not mutated.
