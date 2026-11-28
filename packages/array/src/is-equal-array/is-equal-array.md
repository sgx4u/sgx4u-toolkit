# `isEqualArray`

Reports whether two arrays have the same length and the same items in the same order. A hole equals `undefined`. `NaN` equals `NaN` by default, and `-0` equals `0`. A different order is not equal. The function never throws.

## Import

```ts
import { isEqualArray, type IsEqualArrayParams } from "@sgx4u/array";
```

## Signature

```ts
function isEqualArray<Item>(params: IsEqualArrayParams<Item>): boolean;
```

## Parameters

| Name     | Type              | Default       | Description                                |
| -------- | ----------------- | ------------- | ------------------------------------------ |
| `first`  | `readonly Item[]` |               | The first array.                           |
| `second` | `readonly Item[]` |               | The second array.                          |
| `equals` | `Equals<Item>`    | SameValueZero | An invalid value makes the result `false`. |

## Examples

```ts
isEqualArray({ first: [1, Number.NaN], second: [1, Number.NaN] });
// true
```

## Edge cases

- `null`, `{}`, a string, a `Uint8Array`, a `Set`, and a generator return `false`.
- Either side not being an array returns `false`. A non-function `equals` returns `false`.
- Different lengths return `false`. The inputs are not mutated.
