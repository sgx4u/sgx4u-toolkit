# `getSortedInsertIndex`

Returns the lowest index at which `value` can be inserted while keeping ascending order. Equal values land on the leftmost match. The array is assumed sorted ascending, with nullish keys and `NaN` last. The result is from `0` through `array.length`.

A function `by` is called with the item, index `0`, and a one-element array. The searched value is read the same way.

## Import

```ts
import {
    getSortedInsertIndex,
    type GetSortedInsertIndexParams,
} from "@sgx4u/array";
```

## Signature

```ts
function getSortedInsertIndex<Item>(
    params: GetSortedInsertIndexParams<Item>,
): number | undefined;
```

## Parameters

| Name      | Type                          | Default            | Description                                          |
| --------- | ----------------------------- | ------------------ | ---------------------------------------------------- |
| `array`   | `readonly Item[]`             |                    | A sorted array. It is not mutated.                   |
| `value`   | `Item`                        |                    | The value to place.                                  |
| `by`      | `Iteratee<Item>`              | the item           | Property key or function.                            |
| `locale`  | `string \| readonly string[]` | the runtime locale | Use the locale the array was sorted with.            |
| `numeric` | `boolean`                     | `false`            | When `true`, number-like strings compare as numbers. |

## Examples

```ts
getSortedInsertIndex({ array: [1, 2, 2, 3], value: 2 });
// 1
```

## Edge cases

- A non-array `array` returns `undefined`. `null`, `{}`, a string, a `Uint8Array`, a `Set`, and a generator return `undefined`.
- An invalid `by` throws `TypeError`. A non-boolean `numeric` throws `TypeError`. An invalid locale throws `RangeError`. These are checked before `array`.
- An empty array returns `0`. Holes are read as `undefined`.
- `nulls` is `"last"` and the direction is ascending. A search of an array sorted with different options will not land in the right place.
