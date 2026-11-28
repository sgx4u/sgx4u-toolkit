# `getDifference`

Keeps unique items from `array` that appear in none of `others`. Order is first-seen in `array`. An empty `others` list returns the unique items of `array`. `by` wins over `equals`. The stored value is the original item from `array`.

## Import

```ts
import { getDifference, type GetDifferenceParams } from "@sgx4u/array";
```

## Signature

```ts
function getDifference<Item>(
    params: GetDifferenceParams<Item>,
): Item[] | undefined;
```

## Parameters

| Name     | Type                           | Default       | Description                                         |
| -------- | ------------------------------ | ------------- | --------------------------------------------------- |
| `array`  | `readonly Item[]`              |               | Items that may be kept.                             |
| `others` | `readonly (readonly Item[])[]` |               | Arrays of items to exclude.                         |
| `by`     | `Iteratee<Item>`               |               | When set, exclusion uses SameValueZero on this key. |
| `equals` | `Equals<Item>`                 | SameValueZero | Used only when `by` is omitted.                     |

## Examples

```ts
getDifference({ array: [1, 2, 2, 3], others: [[2], [4]] });
// [1, 3]
```

## Edge cases

- A missing `others`, a non-array `others`, or a slot that is not an array returns `undefined`.
- A non-array `array` returns `undefined`.
- An invalid `by`, or an invalid `equals` when `by` is omitted, throws `TypeError` before the arrays are checked.
- `NaN` matches `NaN`, and `-0` matches `0`. Holes are `undefined`. The inputs are not mutated.
