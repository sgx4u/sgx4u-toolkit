# `sliceArray`

Returns a dense copy of an array slice. Indexes follow `Array#slice`: a negative index counts from the end and is clamped, and a finite non-integer is truncated toward zero. Omitted `start` is `0`. Omitted `end` is the array length. The slice is taken from a dense copy, so a hole becomes `undefined`. The input is not mutated. When `start` or `end` is present, it is checked before `array`.

## Import

```ts
import { sliceArray, type SliceArrayParams } from "@sgx4u/array";
```

## Signature

```ts
function sliceArray<Item>(params: SliceArrayParams<Item>): Item[] | undefined;
```

## Parameters

| Parameter | Type              | Default          | Description                                                |
| --------- | ----------------- | ---------------- | ---------------------------------------------------------- |
| `array`   | `readonly Item[]` |                  | The array to copy from. A non-array returns `undefined`.   |
| `start`   | `number`          | `0`              | First index to keep. A negative index counts from the end. |
| `end`     | `number`          | the array length | Index at which to stop, exclusive.                         |

## Examples

```ts
sliceArray({ array: [0, 1, 2, 3, 4], start: 1, end: 3 }); // [1, 2]
sliceArray({ array: [0, 1, 2, 3, 4], start: -2 }); // [3, 4]
sliceArray({ array: [0, 1, 2, 3, 4], start: 1.9, end: 4.2 }); // [1, 2, 3]
```

## Edge cases

| Call                                                        | Result                   |
| ----------------------------------------------------------- | ------------------------ |
| omitted `start` and `end`                                   | a new dense copy         |
| `start` past the end                                        | a new `[]`               |
| a negative index before the start                           | clamped                  |
| an empty array                                              | a new `[]`               |
| a sparse array                                              | holes become `undefined` |
| `null`, `{}`, `"text"`, a typed array, a `Set`, a generator | `undefined`              |
| `NaN` or an infinity                                        | throws `RangeError`      |
| a non-number bound                                          | throws `TypeError`       |

A bad bound throws even when `array` is not an array.

```text
`end` must be a finite number; received Infinity.
```
