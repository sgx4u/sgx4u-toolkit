# `shuffleItems`

Returns a new array with the same items in a random order. The shuffle is Fisher–Yates on a copy, so the input is left unchanged.

## Import

```ts
import { shuffleItems } from "@sgx4u/array";
```

## Signature

```ts
function shuffleItems<Item>(array: readonly Item[]): Item[];
function shuffleItems<Item>(params: ShuffleItemsParams<Item>): Item[];
```

`ShuffleItemsParams` is `{ array, random?, seed? }`. A bare array is the same as `{ array }`.

## Parameters

| Name     | Description                                                                                                    |
| -------- | -------------------------------------------------------------------------------------------------------------- |
| `array`  | Items to reorder.                                                                                              |
| `random` | Optional function that returns a number in `[0, 1)`. Ignored when `seed` is finite. Defaults to `Math.random`. |
| `seed`   | Optional finite number. A finite seed selects a deterministic generator.                                       |

## Examples

```ts
shuffleItems([1, 2, 3]);
shuffleItems({ array: [1, 2, 3], seed: 1 });
```

Two calls with the same array and the same seed return the same permutation.

## Edge cases

| Input                                                             | Result                                |
| ----------------------------------------------------------------- | ------------------------------------- |
| `[]`                                                              | `[]`                                  |
| A value that is not an array, or `{ array }` that is not an array | `undefined`                           |
| A sparse hole                                                     | The hole is `undefined` in the result |
| `seed` that is not finite                                         | Throws `RangeError`                   |
| `random` that is not a function                                   | Throws `TypeError`                    |
| `random` that returns a number outside `[0, 1)`                   | Throws `RangeError`                   |

The result is a new array. A frozen input is not mutated.
