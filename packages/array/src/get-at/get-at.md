# `getAt`

Returns the item at `index`. A negative index counts from the end, as `Array#at` does. A non-integer, or an index outside the array, returns `undefined` and does not throw. The result is the item itself, not a copy of the array. A hole is `undefined`. The array is not mutated.

## Import

```ts
import { getAt, type GetAtParams } from "@sgx4u/array";
```

## Signature

```ts
function getAt<Item>(params: GetAtParams<Item>): Item | undefined;
```

## Parameters

| Parameter | Type              | Description                                                                         |
| --------- | ----------------- | ----------------------------------------------------------------------------------- |
| `array`   | `readonly Item[]` | The array to read. A non-array returns `undefined`.                                 |
| `index`   | `number`          | The position. Negative indexes count from the end. Non-integers return `undefined`. |

## Examples

```ts
getAt({ array: [1, 2, 3], index: 0 }); // 1
getAt({ array: [1, 2, 3], index: -1 }); // 3
getAt({ array: [1, 2, 3], index: 1.5 }); // undefined
getAt({ array: [1, 2, 3], index: 9 }); // undefined
```

## Edge cases

| Call                                | Result        |
| ----------------------------------- | ------------- |
| index `0` on `[1]`                  | `1`           |
| index `-1`                          | the last item |
| index past either end               | `undefined`   |
| a non-integer index                 | `undefined`   |
| an empty array                      | `undefined`   |
| a hole                              | `undefined`   |
| `null`, `{}`, `"text"`              | `undefined`   |
| a typed array, a `Set`, a generator | `undefined`   |

A missing `index` returns `undefined`. The function does not throw for a bad index.
