# `mergeSorted`

Merges two sorted arrays into a new sorted array. Both inputs are assumed sorted ascending, with nullish keys and `NaN` last. When the keys compare equal, the item from `first` is taken, so ties keep `first` ahead of `second`. Either side not being an array returns `undefined`.

A function `by` is called with the item, index `0`, and a one-element array.

## Import

```ts
import { mergeSorted, type MergeSortedParams } from "@sgx4u/array";
```

## Signature

```ts
function mergeSorted<Item>(params: MergeSortedParams<Item>): Item[] | undefined;
```

## Parameters

| Name      | Type                          | Default            | Description                                                |
| --------- | ----------------------------- | ------------------ | ---------------------------------------------------------- |
| `first`   | `readonly Item[]`             |                    | The first sorted array. On a tie, its item is taken first. |
| `second`  | `readonly Item[]`             |                    | The second sorted array.                                   |
| `by`      | `Iteratee<Item>`              | the item           | Property key or function.                                  |
| `locale`  | `string \| readonly string[]` | the runtime locale | Use the locale both arrays were sorted with.               |
| `numeric` | `boolean`                     | `false`            | When `true`, number-like strings compare as numbers.       |

## Examples

```ts
mergeSorted({ first: [1, 3], second: [2, 3, 4] });
// [1, 2, 3, 3, 4]
```

## Edge cases

- A non-object returns `undefined`. Either side not being an array returns `undefined`.
- An invalid `by`, `numeric`, or `locale` throws before the arrays are checked.
- An empty side returns a copy of the other side, not the same reference.
- Holes are read as `undefined`. The inputs are not mutated.
