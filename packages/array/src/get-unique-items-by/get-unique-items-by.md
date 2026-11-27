# `getUniqueItemsBy`

Drops items whose `by` result was already seen. Comparison is SameValueZero on the key, not a custom `equals`. The stored value is the original item. `keep` defaults to `"first"`. `"last"` keeps the later item in the order those later items appear.

## Import

```ts
import { getUniqueItemsBy, type GetUniqueItemsByParams } from "@sgx4u/array";
```

## Signature

```ts
function getUniqueItemsBy<Item>(
    params: GetUniqueItemsByParams<Item>,
): Item[] | undefined;
```

## Parameters

| Name    | Type                | Default   | Description                       |
| ------- | ------------------- | --------- | --------------------------------- |
| `array` | `readonly Item[]`   |           | Items to scan from left to right. |
| `by`    | `Iteratee<Item>`    |           | Property key or function.         |
| `keep`  | `"first" \| "last"` | `"first"` | Which occurrence to keep.         |

## Examples

```ts
getUniqueItemsBy({
    array: [
        { id: 1, name: "a" },
        { id: 1, name: "c" },
    ],
    by: "id",
});
// [{ id: 1, name: "a" }]
```

## Edge cases

- A non-object returns `undefined`. A non-array `array` returns `undefined` when `by` and `keep` are valid.
- An invalid `by` throws `TypeError`. An unknown `keep` throws `RangeError`.
- `NaN` keys match, and `-0` matches `0`. Objects match by reference.
- Holes are read as `undefined`. The input is not mutated. The result is a new array.
