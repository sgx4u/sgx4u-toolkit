# `partition`

Splits an array into items that match a predicate and items that do not. Both buckets keep the original order.

## Import

```ts
import { partition, type PartitionParams } from "@sgx4u/array";
```

## Signature

```ts
function partition<Item>(
    params: PartitionParams<Item>,
): [Item[], Item[]] | undefined;
```

## Parameters

| Name        | Type              | Description                                         |
| ----------- | ----------------- | --------------------------------------------------- |
| `array`     | `readonly Item[]` | Items to split.                                     |
| `predicate` | `Predicate<Item>` | Receives the item, its index, and the source array. |

## Examples

```ts
partition({ array: [1, 2, 3, 4], predicate: (item) => item % 2 === 0 });
// [[2, 4], [1, 3]]
```

## Edge cases

- A non-object returns `undefined`. A non-array `array` returns `undefined` when `predicate` is a function.
- A missing or non-function `predicate` throws `TypeError` before `array` is checked.
- An empty array returns `[[], []]`.
- Holes are passed as `undefined`. The input is not mutated. Both buckets are new arrays.
