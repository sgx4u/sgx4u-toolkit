# `getCartesianProduct`

Returns every tuple from the cartesian product of the arrays. The last array varies fastest. Each tuple is a new array.

The product of `n` arrays whose lengths are `a`, `b`, and so on has `a * b * ...` tuples. An empty list, or any empty array, produces no tuples.

## Import

```ts
import { getCartesianProduct } from "@sgx4u/array/combinatorics";
```

## Signature

```ts
function getCartesianProduct<Item>(
    params: GetCartesianProductParams<Item>,
): Item[][] | undefined;
```

## Parameters

| Name     | Description            |
| -------- | ---------------------- |
| `arrays` | The arrays to combine. |

## Examples

```ts
getCartesianProduct({
    arrays: [
        [1, 2],
        ["a", "b"],
    ],
});
// [[1, "a"], [1, "b"], [2, "a"], [2, "b"]]
```

## Edge cases

| Input                                               | Result      |
| --------------------------------------------------- | ----------- |
| `arrays` is `[]`                                    | `[]`        |
| Any input array is empty                            | `[]`        |
| `arrays` is not an array, or a slot is not an array | `undefined` |

The inputs are not mutated.
