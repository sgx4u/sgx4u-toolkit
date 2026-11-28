# `setAt`

Replaces the item at an index and returns a new array, like `Array#with`. The input is not mutated. A function value is stored and is not called.

## Import

```ts
import { setAt } from "@sgx4u/array";
```

## Signature

```ts
function setAt<Item>(params: SetAtParams<Item>): Item[] | undefined;
```

## Parameters

| Name    | Type              | Description                                             |
| ------- | ----------------- | ------------------------------------------------------- |
| `array` | `readonly Item[]` | Source array.                                           |
| `index` | `number`          | Index to replace. A negative index counts from the end. |
| `value` | `Item`            | Value to store.                                         |

## Examples

```ts
setAt({ array: [1, 2, 3], index: 1, value: 9 }); // [1, 9, 3]
setAt({ array: [1, 2, 3], index: -1, value: 9 }); // [1, 2, 9]
```

## Edge cases

- `null`, `{}`, a string, a typed array, a `Set`, or a generator returns `undefined`.
- A non-integer index, or an index outside the array, returns `undefined`.
- An empty array has no index to replace.
- A function `value` is stored. `updateAt` would call that function instead.
- A frozen array is not mutated. The result is a new array.
- A hole in the source becomes `undefined` in the result.
