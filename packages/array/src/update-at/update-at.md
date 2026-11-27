# `updateAt`

Replaces the item at an index and returns a new array. The input is not mutated.

`updater` may be the next item, or a function `(item, index) => item`. A function is always called. A function value cannot be stored here. Use `setAt` for that.

## Import

```ts
import { updateAt } from "@sgx4u/array";
```

## Signature

```ts
function updateAt<Item>(params: UpdateAtParams<Item>): Item[] | undefined;
```

## Parameters

| Name      | Type                            | Description                                                            |
| --------- | ------------------------------- | ---------------------------------------------------------------------- |
| `array`   | `readonly Item[]`               | Source array.                                                          |
| `index`   | `number`                        | Index to update. A negative index counts from the end.                 |
| `updater` | `Item \| (item, index) => Item` | Next item, or a function that returns it. A function is always called. |

## Examples

```ts
updateAt({ array: [1, 2, 3], index: 1, updater: 9 }); // [1, 9, 3]
updateAt({
    array: [1, 2, 3],
    index: -1,
    updater: (item) => item * 10,
}); // [1, 2, 30]
```

## Edge cases

- `null`, `{}`, a string, a typed array, a `Set`, or a generator returns `undefined`.
- A non-integer index, or an index outside the array, returns `undefined`.
- An empty array has no index to update.
- A function `updater` is called with the current item and the resolved index. It is not stored.
- A frozen array is not mutated. The result is a new array.
- A hole is passed to the updater as `undefined`.
