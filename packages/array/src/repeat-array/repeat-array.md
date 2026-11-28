# `repeatArray`

Concatenates `count` shallow copies of an array and returns a new array. The input is not mutated.

`count` of `0` returns `[]`. `count` of `1` returns a shallow copy, not the same array. A non-array `array` returns `undefined`. This is one of the two phase-8 functions that can return `undefined`.

## Import

```ts
import { repeatArray } from "@sgx4u/array";
```

## Signature

```ts
function repeatArray<Item>(params: RepeatArrayParams<Item>): Item[] | undefined;
```

## Parameters

| Name    | Type              | Description                                                                                    |
| ------- | ----------------- | ---------------------------------------------------------------------------------------------- |
| `array` | `readonly Item[]` | Array to repeat.                                                                               |
| `count` | `number`          | How many shallow copies to concatenate. Must be a finite integer greater than or equal to `0`. |

## Examples

```ts
repeatArray({ array: [1, 2], count: 3 }); // [1, 2, 1, 2, 1, 2]
repeatArray({ array: [1], count: 0 }); // []
repeatArray({ array: [1, 2], count: 1 }); // [1, 2]
```

## Edge cases

- `null`, a string, or another non-object returns `undefined`.
- A non-array `array` returns `undefined` when `count` is a valid integer. That includes `{}`, a typed array, a `Set`, and a generator passed as `array`.
- `{}` throws `TypeError` because `count` is missing. The check runs before `array` is read.
- A negative, fractional, or non-finite `count` throws `RangeError`, even when `array` is invalid.
- A hole becomes `undefined`. Item references are preserved.
- The input is not mutated. The result is a new array.
