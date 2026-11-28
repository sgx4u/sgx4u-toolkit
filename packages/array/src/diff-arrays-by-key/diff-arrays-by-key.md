# `diffArraysByKey`

Compares two arrays by key. Identity is the key, compared with SameValueZero. `equals` decides whether two items that share a key are updated or unchanged.

`moved` is the same key and equal values whose index changed. The indexes are the first occurrence of that key on each side. A changed value is `updated` only, even when the index also changed. A new key is added. A missing key is removed.

The first occurrence of a key is the primary item. A later duplicate on `first` is an extra removal, and a later duplicate on `second` is an extra addition. Extras are interleaved with the other changes in appearance order.

## Import

```ts
import { diffArraysByKey } from "@sgx4u/array";
```

## Signature

```ts
function diffArraysByKey<Item>(
    params: DiffArraysByKeyParams<Item>,
): KeyedArrayDiff<Item> | undefined;
```

`KeyedArrayDiff` is `{ added, removed, updated, moved, unchanged }`.

## Parameters

| Name     | Description                                                                      |
| -------- | -------------------------------------------------------------------------------- |
| `first`  | The previous array.                                                              |
| `second` | The next array.                                                                  |
| `key`    | A property key or a function. Keys use SameValueZero.                            |
| `equals` | Optional comparer for the two items that share a key. Defaults to SameValueZero. |

## Examples

```ts
diffArraysByKey({
    first: [{ id: 1, name: "a" }],
    second: [{ id: 1, name: "b" }],
    key: "id",
    equals: (left, right) => left.name === right.name,
});
// updated: [{ previous: { id: 1, name: "a" }, next: { id: 1, name: "b" } }]
```

## Edge cases

| Input                           | Result                                                                 |
| ------------------------------- | ---------------------------------------------------------------------- |
| Either side is not an array     | `undefined`                                                            |
| Duplicate keys                  | The first item is primary. Later copies are extra `removed` or `added` |
| Equal values, different index   | `moved`, not `unchanged`                                               |
| Unequal values, different index | `updated` only, not also `moved`                                       |
| `key` is not an iteratee        | Throws `TypeError`                                                     |
| `equals` is not a function      | Throws `TypeError`                                                     |

Each list is a new array. The inputs are not mutated.
