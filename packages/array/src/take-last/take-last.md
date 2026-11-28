# `takeLast`

Returns the last `count` items, in their original order, or fewer when the array is shorter. `count` of `0` returns a new empty array. The result is a new dense array. The input is not mutated. When the argument is a params object, `count` is checked before `array`.

## Import

```ts
import { takeLast, type TakeLastParams } from "@sgx4u/array";
```

## Signature

```ts
function takeLast<Item>(params: TakeLastParams<Item>): Item[] | undefined;
```

## Parameters

| Parameter | Type              | Description                                                                     |
| --------- | ----------------- | ------------------------------------------------------------------------------- |
| `array`   | `readonly Item[]` | The array to copy from. A non-array returns `undefined`.                        |
| `count`   | `number`          | How many trailing items to keep. A finite integer greater than or equal to `0`. |

## Examples

```ts
takeLast({ array: [1, 2, 3, 4], count: 2 }); // [3, 4]
takeLast({ array: [1, 2], count: 0 }); // []
takeLast({ array: [1, 2], count: 10 }); // [1, 2]
```

## Edge cases

| Call                                          | Result                         |
| --------------------------------------------- | ------------------------------ |
| `count` of `0`                                | a new `[]`                     |
| `count` past the start                        | a copy of every item, in order |
| an empty array                                | a new `[]`                     |
| a sparse array                                | holes become `undefined`       |
| `null`, `"text"`                              | `undefined`                    |
| a missing or non-numeric `count`              | throws `TypeError`             |
| a negative, fractional, or non-finite `count` | throws `RangeError`            |

`{}`, a typed array, a `Set`, and a generator throw because `count` is missing.
