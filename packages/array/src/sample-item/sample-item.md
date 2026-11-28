# `sampleItem`

Returns one item chosen uniformly from the array.

## Import

```ts
import { sampleItem } from "@sgx4u/array";
```

## Signature

```ts
function sampleItem<Item>(array: readonly Item[]): Item | undefined;
function sampleItem<Item>(params: SampleItemParams<Item>): Item | undefined;
```

`SampleItemParams` is `{ array, random?, seed? }`. A bare array is the same as `{ array }`.

## Parameters

| Name     | Description                                                                                                    |
| -------- | -------------------------------------------------------------------------------------------------------------- |
| `array`  | Items to draw from.                                                                                            |
| `random` | Optional function that returns a number in `[0, 1)`. Ignored when `seed` is finite. Defaults to `Math.random`. |
| `seed`   | Optional finite number. A finite seed selects a deterministic generator.                                       |

## Examples

```ts
sampleItem([1, 2, 3]);
sampleItem({ array: [1, 2, 3], seed: 1 });
sampleItem([]); // undefined
```

## Edge cases

| Input                                           | Result                                   |
| ----------------------------------------------- | ---------------------------------------- |
| `[]`                                            | `undefined`                              |
| A value that is not an array                    | `undefined`                              |
| A one-item array                                | That item                                |
| A sparse hole                                   | The hole is `undefined` and can be drawn |
| `seed` that is not finite                       | Throws `RangeError`                      |
| `random` that is not a function                 | Throws `TypeError`                       |
| `random` that returns a number outside `[0, 1)` | Throws `RangeError`                      |

The input array is not mutated.
