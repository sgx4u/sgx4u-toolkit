# `updateWhere`

Updates the first matching item, or every match when `all` is true, and returns a new array. The input is not mutated. `updater` is a function `(item, index) => item`. It is not a stored replacement value.

## Import

```ts
import { updateWhere } from "@sgx4u/array";
```

## Signature

```ts
function updateWhere<Item>(params: UpdateWhereParams<Item>): Item[] | undefined;
```

## Parameters

| Name        | Type                              | Default | Description                                 |
| ----------- | --------------------------------- | ------- | ------------------------------------------- |
| `array`     | `readonly Item[]`                 |         | Source array.                               |
| `predicate` | `(item, index, array) => boolean` |         | Selects items to update.                    |
| `updater`   | `(item, index) => Item`           |         | Returns the replacement. Required function. |
| `all`       | `boolean`                         | `false` | Update every match instead of the first.    |

## Examples

```ts
updateWhere({
    array: [1, 2, 3, 4],
    predicate: (item) => item % 2 === 0,
    updater: (item) => item * 10,
}); // [1, 20, 3, 4]

updateWhere({
    array: [1, 2, 3, 4],
    predicate: (item) => item % 2 === 0,
    updater: (item) => item * 10,
    all: true,
}); // [1, 20, 3, 40]
```

## Edge cases

- `null`, `{}`, a string, a typed array, a `Set`, or a generator returns `undefined`.
- Nothing matched, including an empty array, returns a shallow copy.
- A present `predicate` or `updater` that is not a function throws `TypeError` before `array` is checked.
- A real array that omits `predicate` or `updater` throws `TypeError`.
- A frozen array is not mutated. The result is a new array.
- A hole is passed to the predicate as `undefined`.
