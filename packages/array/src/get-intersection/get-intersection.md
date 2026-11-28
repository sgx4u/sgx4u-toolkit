# `getIntersection`

Keeps items from the first array that appear in every later array. The result is unique and stays in first-seen order. One array returns that array's unique items. An empty list returns `[]`, not `undefined`. `by` wins over `equals`. The stored item comes from the first array.

## Import

```ts
import { getIntersection, type GetIntersectionParams } from "@sgx4u/array";
```

## Signature

```ts
function getIntersection<Item>(
    params: GetIntersectionParams<Item>,
): Item[] | undefined;
```

## Parameters

| Name     | Type                           | Default       | Description                                        |
| -------- | ------------------------------ | ------------- | -------------------------------------------------- |
| `arrays` | `readonly (readonly Item[])[]` |               | The first array supplies the result.               |
| `by`     | `Iteratee<Item>`               |               | When set, presence uses SameValueZero on this key. |
| `equals` | `Equals<Item>`                 | SameValueZero | Used only when `by` is omitted.                    |

## Examples

```ts
getIntersection({
    arrays: [
        [1, 2, 2],
        [2, 3],
        [2, 4],
    ],
});
// [2]
```

## Edge cases

- A non-array `arrays` value, or a slot that is not an array, returns `undefined`.
- `[]` returns `[]`. `[[1, 1, 2]]` returns `[1, 2]`.
- An invalid `by`, or an invalid `equals` when `by` is omitted, throws `TypeError` before the list is checked.
- `NaN` matches `NaN`, and `-0` matches `0`. The inputs are not mutated.
