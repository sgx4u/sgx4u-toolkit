# `removeAt`

Removes items starting at an index and returns a new array. The input is not mutated.

## Import

```ts
import { removeAt } from "@sgx4u/array";
```

## Signature

```ts
function removeAt<Item>(params: RemoveAtParams<Item>): Item[] | undefined;
```

## Parameters

| Name    | Type              | Default | Description                                                                          |
| ------- | ----------------- | ------- | ------------------------------------------------------------------------------------ |
| `array` | `readonly Item[]` |         | Source array.                                                                        |
| `index` | `number`          |         | First index to remove. A negative index counts from the end.                         |
| `count` | `number`          | `1`     | How many items to remove. `0` copies the array when the index is inside `0..length`. |

## Examples

```ts
removeAt({ array: [1, 2, 3], index: 1 }); // [1, 3]
removeAt({ array: [1, 2, 3, 4], index: 1, count: 2 }); // [1, 4]
removeAt({ array: [1, 2, 3, 4], index: -1 }); // [1, 2, 3]
removeAt({ array: [1, 2, 3], index: 1, count: 10 }); // [1]
removeAt({ array: [1, 2, 3], index: 3, count: 0 }); // [1, 2, 3]
```

## Edge cases

- `null`, `{}`, a string, a typed array, a `Set`, or a generator returns `undefined`.
- An out-of-range index returns `undefined`. When `count` is greater than `0`, a negative index must land on an existing element.
- When `count` is `0`, an index equal to the length is valid and returns a shallow copy. Any other out-of-range index returns `undefined`.
- A `count` that runs past the end removes through the end.
- A present `count` that is not a finite integer greater than or equal to `0` throws. The check runs even when `array` is invalid.
- A frozen array is not mutated. The result is a new array.
- A hole in the source becomes `undefined` in the result.
