# `sampleWeighted`

Draws items with probability proportional to a weight. The result is a new array of `count` items.

## Import

```ts
import { sampleWeighted } from "@sgx4u/array";
```

## Signature

```ts
function sampleWeighted<Item>(
    params: SampleWeightedParams<Item>,
): Item[] | undefined;
```

## Parameters

| Name          | Description                                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------------- |
| `array`       | Items to draw from.                                                                                            |
| `weight`      | A property key or a function. It must return a finite number greater than or equal to 0.                       |
| `count`       | How many items to draw. Defaults to `1`.                                                                       |
| `replacement` | When `true`, drawn items keep their weight. Defaults to `false`.                                               |
| `random`      | Optional function that returns a number in `[0, 1)`. Ignored when `seed` is finite. Defaults to `Math.random`. |
| `seed`        | Optional finite number. A finite seed selects a deterministic generator.                                       |

Without replacement, the function picks an item proportional to the current weights and then sets that item's weight to 0. With replacement, the weights stay.

## Examples

```ts
sampleWeighted({
    array: ["a", "b"],
    weight: (item) => (item === "a" ? 1 : 3),
    seed: 1,
});
// ["a"] or ["b"], as a one-item array

sampleWeighted({
    array: ["a", "b"],
    weight: () => 0,
}); // undefined

sampleWeighted({
    array: ["a", "b"],
    weight: () => 1,
    count: 0,
}); // []
```

## Edge cases

| Input                                                                     | Result                                                                                                   |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Every weight is 0, or the array is empty, and `count` is not 0            | `undefined`                                                                                              |
| `count` is `0`                                                            | `[]`, including when every weight is 0                                                                   |
| `array` is not an array                                                   | `undefined`                                                                                              |
| A weight is not finite or is negative                                     | Throws `RangeError`: `` `weight` must return a finite number greater than or equal to 0; received ... `` |
| `weight` is not a property key or a function                              | Throws `TypeError`                                                                                       |
| `replacement` is false and `count` exceeds the number of positive weights | Throws `RangeError`                                                                                      |
| `count` is not a finite integer greater than or equal to 0                | Throws `TypeError` or `RangeError`                                                                       |
| `replacement` is not a boolean                                            | Throws `TypeError`                                                                                       |
| `seed` is not finite                                                      | Throws `RangeError`                                                                                      |
| `random` is not a function, or returns a number outside `[0, 1)`          | Throws `TypeError` or `RangeError`                                                                       |

A weight of 0 is never drawn. The input array is not mutated. The result is a new array.
