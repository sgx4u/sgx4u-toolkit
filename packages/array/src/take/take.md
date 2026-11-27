# `take`

Returns the first `count` items, or fewer when the array is shorter. `count` of `0` returns a new empty array. The result is a new dense array, so a hole becomes `undefined`. The input is not mutated. When the argument is a params object, `count` is checked before `array`.

## Import

```ts
import { take, type TakeParams } from "@sgx4u/array";
```

## Signature

```ts
function take<Item>(params: TakeParams<Item>): Item[] | undefined;
```

## Parameters

| Parameter | Type              | Description                                                                    |
| --------- | ----------------- | ------------------------------------------------------------------------------ |
| `array`   | `readonly Item[]` | The array to copy from. A non-array returns `undefined`.                       |
| `count`   | `number`          | How many leading items to keep. A finite integer greater than or equal to `0`. |

## Examples

```ts
take({ array: [1, 2, 3, 4], count: 2 }); // [1, 2]
take({ array: [1, 2], count: 0 }); // []
take({ array: [1, 2], count: 10 }); // [1, 2]
```

## Edge cases

| Call                                               | Result                   |
| -------------------------------------------------- | ------------------------ |
| `count` of `0`                                     | a new `[]`               |
| `count` past the end                               | a copy of every item     |
| an empty array                                     | a new `[]`               |
| a sparse array                                     | holes become `undefined` |
| `null`, `"text"`                                   | `undefined`              |
| a non-array with a valid `count`                   | `undefined`              |
| a missing `count`, or `count` that is not a number | throws `TypeError`       |
| a negative, fractional, or non-finite `count`      | throws `RangeError`      |

`{}`, a typed array, a `Set`, and a generator are objects without `count`, so they throw. `count` is checked even when `array` is not an array.

```text
`count` must be a finite integer greater than or equal to 0; received -1.
```
