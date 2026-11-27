# `moveItem`

Moves one item so that it occupies `to` in the result. The input is not mutated.

The item is removed from `from` first. It is then inserted at `to` in that shorter array. `to` is the index in the result, and it must already exist on the source.

## Import

```ts
import { moveItem } from "@sgx4u/array";
```

## Signature

```ts
function moveItem<Item>(params: MoveItemParams<Item>): Item[] | undefined;
```

## Parameters

| Name    | Type              | Description                                                                  |
| ------- | ----------------- | ---------------------------------------------------------------------------- |
| `array` | `readonly Item[]` | Source array.                                                                |
| `from`  | `number`          | Index of the item to move. A negative index counts from the end.             |
| `to`    | `number`          | Index the item occupies in the result. A negative index counts from the end. |

## Examples

```ts
moveItem({ array: [1, 2, 3, 4], from: 0, to: 3 }); // [2, 3, 4, 1]
moveItem({ array: [1, 2, 3, 4], from: 3, to: 0 }); // [4, 1, 2, 3]
moveItem({ array: [1, 2, 3], from: -1, to: 0 }); // [3, 1, 2]
```

## Edge cases

- `null`, `{}`, a string, a typed array, a `Set`, or a generator returns `undefined`.
- Either index outside `0..length - 1`, including a non-integer, returns `undefined`. `to` cannot be the length.
- An empty array returns `undefined`.
- The same `from` and `to` returns a shallow copy.
- A frozen array is not mutated. The result is a new array.
- A hole is moved as `undefined`.
