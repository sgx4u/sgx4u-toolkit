# `getSymmetricDifference`

Keeps items that occur in an odd number of the input arrays. Each array contributes at most one to the count, so duplicates inside one array do not change the result. Order is first-seen across the arrays from left to right. Two arrays are the usual symmetric difference. `by` wins over `equals`. The stored value is the first item that produced the key.

## Import

```ts
import {
    getSymmetricDifference,
    type GetSymmetricDifferenceParams,
} from "@sgx4u/array";
```

## Signature

```ts
function getSymmetricDifference<Item>(
    params: GetSymmetricDifferenceParams<Item>,
): Item[] | undefined;
```

## Parameters

| Name     | Type                           | Default       | Description                                        |
| -------- | ------------------------------ | ------------- | -------------------------------------------------- |
| `arrays` | `readonly (readonly Item[])[]` |               | Arrays whose presence is counted once per array.   |
| `by`     | `Iteratee<Item>`               |               | When set, presence uses SameValueZero on this key. |
| `equals` | `Equals<Item>`                 | SameValueZero | Used only when `by` is omitted.                    |

## Examples

```ts
getSymmetricDifference({
    arrays: [
        [1, 2, 2],
        [2, 3],
    ],
});
// [1, 3]
```

## Edge cases

- An empty list returns `[]`. A non-array list, or a slot that is not an array, returns `undefined`.
- Three copies of `[1]` return `[1]` because three is odd. `[1]` and `[1]` return `[]`.
- An invalid `by`, or an invalid `equals` when `by` is omitted, throws `TypeError`.
- `NaN` matches `NaN`, and `-0` matches `0`. The inputs are not mutated.
