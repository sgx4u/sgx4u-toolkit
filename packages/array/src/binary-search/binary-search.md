# `binarySearch`

Returns the leftmost index of `value` in a sorted array. The search is a bisect-left followed by an equality check. A missing value returns `undefined`. Duplicate matches prefer the leftmost index.

The array is assumed sorted ascending, with nullish keys and `NaN` last. `NaN` matches `NaN`. A function `by` is called with the item, index `0`, and a one-element array.

## Import

```ts
import { binarySearch, type BinarySearchParams } from "@sgx4u/array";
```

## Signature

```ts
function binarySearch<Item>(
    params: BinarySearchParams<Item>,
): number | undefined;
```

## Parameters

| Name      | Type                          | Default            | Description                                          |
| --------- | ----------------------------- | ------------------ | ---------------------------------------------------- |
| `array`   | `readonly Item[]`             |                    | A sorted array. It is not mutated.                   |
| `value`   | `Item`                        |                    | The value to find.                                   |
| `by`      | `Iteratee<Item>`              | the item           | Property key or function.                            |
| `locale`  | `string \| readonly string[]` | the runtime locale | Use the locale the array was sorted with.            |
| `numeric` | `boolean`                     | `false`            | When `true`, number-like strings compare as numbers. |

## Examples

```ts
binarySearch({ array: [1, 2, 2, 3], value: 2 });
// 1
```

## Edge cases

- A missing value returns `undefined`. A non-array `array` also returns `undefined`.
- `null`, `{}`, a string, a `Uint8Array`, a `Set`, and a generator return `undefined`.
- An invalid `by`, `numeric`, or `locale` throws before `array` is checked.
- An empty array returns `undefined`. Holes are read as `undefined`.
- The direction is ascending and `nulls` is `"last"`.
