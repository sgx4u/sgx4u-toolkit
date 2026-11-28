# `toggleItem`

Removes every item equal to `item`, or inserts `item` when none exist. The input is not mutated.

## Import

```ts
import { toggleItem } from "@sgx4u/array";
```

## Signature

```ts
function toggleItem<Item>(params: ToggleItemParams<Item>): Item[] | undefined;
```

## Parameters

| Name        | Type                       | Default       | Description                                          |
| ----------- | -------------------------- | ------------- | ---------------------------------------------------- |
| `array`     | `readonly Item[]`          |               | Source array.                                        |
| `item`      | `Item`                     |               | Item to remove, or to insert when it is absent.      |
| `equals`    | `(left, right) => boolean` | SameValueZero | Compares an element with `item`. `NaN` equals `NaN`. |
| `placement` | `"start" \| "end"`         | `"end"`       | Where to insert an absent item.                      |

## Examples

```ts
toggleItem({ array: [1, 2, 2, 3], item: 2 }); // [1, 3]
toggleItem({ array: [1, 3], item: 2 }); // [1, 3, 2]
toggleItem({ array: [1, 3], item: 2, placement: "start" }); // [2, 1, 3]
```

## Edge cases

- `null`, `{}`, a string, a typed array, a `Set`, or a generator returns `undefined`.
- Any equal item removes all equal items, not only the first.
- An empty array inserts `item` at the chosen end.
- An unknown `placement` throws `RangeError`. A present `equals` that is not a function throws `TypeError`. Both checks run even when `array` is invalid.
- A frozen array is not mutated. The result is a new array.
- A hole equals `undefined` and is removed when `item` is `undefined`.
