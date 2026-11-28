# `removeItems`

Removes items that match a predicate or equal one of a list of values. The input is not mutated. When both matchers are set, an item is removed when either matches.

## Import

```ts
import { removeItems } from "@sgx4u/array";
```

## Signature

```ts
function removeItems<Item>(params: RemoveItemsParams<Item>): Item[] | undefined;
```

## Parameters

| Name        | Type                              | Default       | Description                                        |
| ----------- | --------------------------------- | ------------- | -------------------------------------------------- |
| `array`     | `readonly Item[]`                 |               | Source array.                                      |
| `predicate` | `(item, index, array) => boolean` |               | Removes an item when it returns true.              |
| `values`    | `readonly Item[]`                 |               | Values to remove.                                  |
| `equals`    | `(left, right) => boolean`        | SameValueZero | Compares an item with a value. `NaN` equals `NaN`. |

At least one of `predicate` and `values` is required when `array` is an array.

## Examples

```ts
removeItems({ array: [1, 2, 3, 2], values: [2] }); // [1, 3]
removeItems({
    array: [1, 2, 3, 4],
    predicate: (item) => item % 2 === 0,
}); // [1, 3]
removeItems({
    array: [1, 2, 3, 4],
    predicate: (item) => item === 1,
    values: [4],
}); // [2, 3]
```

## Edge cases

- `null`, `{}`, a string, a typed array, a `Set`, or a generator returns `undefined`.
- A real array with neither `predicate` nor `values` throws `TypeError` with the message `` `removeItems` requires `predicate` or `values`. ``
- A present `predicate` that is not a function throws `TypeError`.
- A present `values` that is not an array throws `TypeError`.
- A present `equals` that is not a function throws `TypeError`.
- Those type checks run even when `array` is invalid.
- Nothing matched returns a shallow copy, including an empty source.
- A frozen array is not mutated. The result is a new array.
- A hole is passed to the predicate as `undefined` and can be removed by a matching value.
