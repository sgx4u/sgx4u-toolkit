# `insertItems`

Inserts several items at an index and returns a new array. The source array and the inserted array are not mutated.

## Import

```ts
import { insertItems } from "@sgx4u/array";
```

## Signature

```ts
function insertItems<Item>(params: InsertItemsParams<Item>): Item[] | undefined;
```

## Parameters

| Name    | Type              | Description                                                                    |
| ------- | ----------------- | ------------------------------------------------------------------------------ |
| `array` | `readonly Item[]` | Source array.                                                                  |
| `index` | `number`          | Insertion index. A negative index counts from the end. `array.length` appends. |
| `items` | `readonly Item[]` | Items to insert, in order.                                                     |

## Examples

```ts
insertItems({ array: [1, 4], index: 1, items: [2, 3] }); // [1, 2, 3, 4]
insertItems({ array: [1, 2, 3], index: -1, items: [8, 9] }); // [1, 2, 8, 9, 3]
insertItems({ array: [1], index: 1, items: [] }); // [1]
```

## Edge cases

- `null`, `{}`, a string, a typed array, a `Set`, or a generator returns `undefined`.
- A non-integer index, or an index outside `0..length`, returns `undefined`.
- `items` that is present and is not an array throws `TypeError`, even when `array` is also invalid.
- A valid `array` with `items` omitted throws `TypeError`.
- A valid `items` array with a non-array `array` returns `undefined`.
- A frozen array is not mutated. The result is a new array.
- Holes in either array become `undefined` elements.
