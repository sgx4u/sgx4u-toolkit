# `getUniqueSorted`

Drops adjacent duplicates from an array that is already sorted. This is one pass. It is not a full unique: a later repeat that is not next to its twin is kept. `[1, 1, 2, 2, 3, 1]` returns `[1, 2, 3, 1]`.

Comparison is SameValueZero on the key, or on the item when `by` is omitted. `NaN` matches `NaN`, and `-0` matches `0`.

## Import

```ts
import { getUniqueSorted, type GetUniqueSortedParams } from "@sgx4u/array";
```

## Signature

```ts
function getUniqueSorted<Item>(
    params: GetUniqueSortedParams<Item>,
): Item[] | undefined;
```

## Parameters

| Name    | Type              | Description                                        |
| ------- | ----------------- | -------------------------------------------------- |
| `array` | `readonly Item[]` | An array already sorted by the same key.           |
| `by`    | `Iteratee<Item>`  | Optional. Omit it to compare the items themselves. |

## Examples

```ts
getUniqueSorted({ array: [1, 1, 2, 2, 3, 1] });
// [1, 2, 3, 1]
```

## Edge cases

- A non-array returns `undefined`. `null`, `{}`, a string, a `Uint8Array`, a `Set`, and a generator return `undefined`.
- A present `by` that is not an iteratee throws `TypeError` before `array` is checked. An omitted `by` does not throw.
- An empty array returns a new `[]`. The result is never the input reference.
- Holes are read as `undefined`. The input is not mutated.
