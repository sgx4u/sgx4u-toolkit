# `insertItem`

Inserts one item at an index and returns a new array. The input is not mutated.

## Import

```ts
import { insertItem } from "@sgx4u/array";
```

## Signature

```ts
function insertItem<Item>(params: InsertItemParams<Item>): Item[] | undefined;
```

## Parameters

| Name    | Type              | Description                                                                    |
| ------- | ----------------- | ------------------------------------------------------------------------------ |
| `array` | `readonly Item[]` | Source array.                                                                  |
| `index` | `number`          | Insertion index. A negative index counts from the end. `array.length` appends. |
| `item`  | `Item`            | Item to insert.                                                                |

## Examples

```ts
insertItem({ array: [1, 2, 3], index: 1, item: 9 }); // [1, 9, 2, 3]
insertItem({ array: [1, 2, 3], index: -1, item: 9 }); // [1, 2, 9, 3]
insertItem({ array: [1, 2], index: 2, item: 3 }); // [1, 2, 3]
```

## Edge cases

- `null`, `{}`, a string, a typed array, a `Set`, or a generator returns `undefined`.
- A non-integer index, or an index outside `0..length`, returns `undefined`.
- An empty array accepts index `0` and rejects every other index.
- A frozen array is not mutated. The result is a new array.
- A hole in the source becomes an `undefined` element in the result.
