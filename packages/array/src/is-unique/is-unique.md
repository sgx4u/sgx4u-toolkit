# `isUnique`

Reports whether every item is distinct. An empty array is unique, even when `by` or `equals` would be invalid. `by` wins over `equals` and uses SameValueZero on the key. The function never throws.

## Import

```ts
import { isUnique, type IsUniqueParams } from "@sgx4u/array";
```

## Signature

```ts
function isUnique<Item>(params: IsUniqueParams<Item>): boolean;
```

## Parameters

| Name     | Type              | Default       | Description                                                                             |
| -------- | ----------------- | ------------- | --------------------------------------------------------------------------------------- |
| `array`  | `readonly Item[]` |               | Items to scan.                                                                          |
| `by`     | `Iteratee<Item>`  |               | When set, uniqueness uses this key. `equals` is ignored.                                |
| `equals` | `Equals<Item>`    | SameValueZero | Used only when `by` is omitted. An invalid value returns `false` for a non-empty array. |

## Examples

```ts
isUnique({ array: [1, 2, 3] });
// true
```

## Edge cases

- `null`, `{}`, a string, a `Uint8Array`, a `Set`, and a generator return `false`.
- A non-empty array with an invalid `by`, or with an invalid `equals` when `by` is omitted, returns `false`.
- `NaN` is a duplicate of `NaN`. `-0` is a duplicate of `0`.
- Holes are `undefined`. The input is not mutated.
