# `removeAtIndexes`

Removes every listed index and returns a new array. The input is not mutated.

## Import

```ts
import { removeAtIndexes } from "@sgx4u/array";
```

## Signature

```ts
function removeAtIndexes<Item>(
    params: RemoveAtIndexesParams<Item>,
): Item[] | undefined;
```

## Parameters

| Name      | Type                | Description                                             |
| --------- | ------------------- | ------------------------------------------------------- |
| `array`   | `readonly Item[]`   | Source array.                                           |
| `indexes` | `readonly number[]` | Indexes to remove. Negative indexes count from the end. |

## Examples

```ts
removeAtIndexes({ array: [1, 2, 3, 4], indexes: [0, 2] }); // [2, 4]
removeAtIndexes({ array: [1, 2, 3, 4], indexes: [-1, 0] }); // [2, 3]
removeAtIndexes({ array: [1, 2, 3], indexes: [0, 0, 9, 1.5] }); // [2, 3]
```

## Edge cases

- `null`, `{}`, a string, a typed array, a `Set`, or a generator returns `undefined`.
- Out-of-range indexes and non-integers are skipped. They do not make the call return `undefined`.
- Duplicate indexes remove that element once. The order of `indexes` does not matter.
- An empty `indexes` array returns a shallow copy.
- `indexes` that is present and is not an array throws `TypeError`.
- A valid `array` with `indexes` omitted throws `TypeError`.
- A frozen array is not mutated. The result is a new array.
- A hole in the source becomes `undefined` in the result.
