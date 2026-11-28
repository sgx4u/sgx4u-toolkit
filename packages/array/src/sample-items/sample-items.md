# `sampleItems`

Returns `count` distinct items in random order, without replacement.

The draw is a partial Fisher–Yates shuffle. Each index in the prefix of length `count` is swapped with a random index from that position through the end, and the prefix is returned.

## Import

```ts
import { sampleItems } from "@sgx4u/array";
```

## Signature

```ts
function sampleItems<Item>(params: SampleItemsParams<Item>): Item[] | undefined;
```

## Parameters

| Name     | Description                                                                                                    |
| -------- | -------------------------------------------------------------------------------------------------------------- |
| `array`  | Items to draw from.                                                                                            |
| `count`  | How many distinct items to return.                                                                             |
| `random` | Optional function that returns a number in `[0, 1)`. Ignored when `seed` is finite. Defaults to `Math.random`. |
| `seed`   | Optional finite number. A finite seed selects a deterministic generator.                                       |

## Examples

```ts
sampleItems({ array: [1, 2, 3, 4], count: 2, seed: 1 });
sampleItems({ array: [1, 2, 3], count: 0 }); // []
```

## Edge cases

| Input                                          | Result                                                                                                          |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `count` is `0`                                 | `[]`                                                                                                            |
| `array` is not an array                        | `undefined`                                                                                                     |
| `count` greater than the array length          | Throws `RangeError`: `` `count` must be less than or equal to the array length ${length}; received ${count}. `` |
| `count` is negative, fractional, or not finite | Throws `RangeError`                                                                                             |
| `count` is not a number                        | Throws `TypeError`                                                                                              |
| `seed` is not finite                           | Throws `RangeError`                                                                                             |
| `random` is not a function                     | Throws `TypeError`                                                                                              |
| `random` returns a number outside `[0, 1)`     | Throws `RangeError`                                                                                             |
| A sparse hole                                  | The hole is `undefined` and can be drawn                                                                        |

The result is a new array. The input is not mutated.
