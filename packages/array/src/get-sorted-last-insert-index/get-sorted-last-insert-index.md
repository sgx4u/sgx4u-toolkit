# `getSortedLastInsertIndex`

Returns the first index whose item is strictly greater than `value`. This is the bisect-right point, so equal values land after the existing run. The array is assumed sorted ascending, with nullish keys and `NaN` last.

A function `by` is called with the item, index `0`, and a one-element array.

## Import

```ts
import {
    getSortedLastInsertIndex,
    type GetSortedLastInsertIndexParams,
} from "@sgx4u/array";
```

## Signature

```ts
function getSortedLastInsertIndex<Item>(
    params: GetSortedLastInsertIndexParams<Item>,
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
getSortedLastInsertIndex({ array: [1, 2, 2, 3], value: 2 });
// 3
```

## Edge cases

- A non-array returns `undefined`. `null`, `{}`, a string, a `Uint8Array`, a `Set`, and a generator return `undefined`.
- An invalid `by`, `numeric`, or `locale` throws before `array` is checked.
- An empty array returns `0`. Holes are read as `undefined`.
- The direction is ascending and `nulls` is `"last"`.
