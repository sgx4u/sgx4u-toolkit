# `partitionBy`

Places each item in the first predicate that returns true. The result has one array per predicate, in that order, plus a final remainder for items that matched none. An empty predicate list returns one remainder bucket holding a copy of the items.

## Import

```ts
import { partitionBy, type PartitionByParams } from "@sgx4u/array";
```

## Signature

```ts
function partitionBy<Item>(
    params: PartitionByParams<Item>,
): Item[][] | undefined;
```

## Parameters

| Name         | Type                         | Description                                               |
| ------------ | ---------------------------- | --------------------------------------------------------- |
| `array`      | `readonly Item[]`            | Items to place.                                           |
| `predicates` | `readonly Predicate<Item>[]` | Tested from left to right. Each entry must be a function. |

## Examples

```ts
partitionBy({
    array: [1, 2, 3, 4],
    predicates: [(item) => item % 2 === 0, (item) => item > 2],
});
// [[2, 4], [3], [1]]
```

## Edge cases

- A non-object returns `undefined`. A non-array `array` returns `undefined` when every predicate is a function.
- `predicates` must be an array of functions. Anything else throws `TypeError` before `array` is checked.
- Each bucket keeps the original order. The input is not mutated.
- Holes are passed to the predicates as `undefined`.
