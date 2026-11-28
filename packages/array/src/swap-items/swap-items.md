# `swapItems`

Swaps the items at two indexes and returns a new array. The input is not mutated.

## Import

```ts
import { swapItems } from "@sgx4u/array";
```

## Signature

```ts
function swapItems<Item>(params: SwapItemsParams<Item>): Item[] | undefined;
```

## Parameters

| Name     | Type              | Description                                         |
| -------- | ----------------- | --------------------------------------------------- |
| `array`  | `readonly Item[]` | Source array.                                       |
| `first`  | `number`          | First index. A negative index counts from the end.  |
| `second` | `number`          | Second index. A negative index counts from the end. |

## Examples

```ts
swapItems({ array: [1, 2, 3], first: 0, second: 2 }); // [3, 2, 1]
swapItems({ array: [1, 2, 3], first: -1, second: 0 }); // [3, 2, 1]
swapItems({ array: [1, 2, 3], first: 1, second: 1 }); // [1, 2, 3]
```

## Edge cases

- `null`, `{}`, a string, a typed array, a `Set`, or a generator returns `undefined`.
- Either index outside the array, including a non-integer, returns `undefined`.
- An empty array returns `undefined`.
- The same index returns a shallow copy.
- Swapping the same pair twice restores the original items.
- A frozen array is not mutated. The result is a new array.
- A hole is swapped as `undefined`.
