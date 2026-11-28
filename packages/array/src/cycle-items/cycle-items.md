# `cycleItems`

Takes `count` items, wrapping back to the start, and returns a new array. The input is not mutated.

An empty array returns `[]` for any valid `count`, including a count greater than `0`. A non-array `array` returns `undefined`. This is one of the two phase-8 functions that can return `undefined`.

## Import

```ts
import { cycleItems } from "@sgx4u/array";
```

## Signature

```ts
function cycleItems<Item>(params: CycleItemsParams<Item>): Item[] | undefined;
```

## Parameters

| Name    | Type              | Description                                                                    |
| ------- | ----------------- | ------------------------------------------------------------------------------ |
| `array` | `readonly Item[]` | Source array. An empty array yields no items.                                  |
| `count` | `number`          | How many items to take. Must be a finite integer greater than or equal to `0`. |

## Examples

```ts
cycleItems({ array: [1, 2, 3], count: 5 }); // [1, 2, 3, 1, 2]
cycleItems({ array: [1, 2, 3], count: 2 }); // [1, 2]
cycleItems({ array: [], count: 5 }); // []
cycleItems({ array: [1], count: 0 }); // []
```

## Edge cases

- `null`, a string, or another non-object returns `undefined`.
- A non-array `array` returns `undefined` when `count` is a valid integer. That includes `{}`, a typed array, a `Set`, and a generator passed as `array`.
- `{}` throws `TypeError` because `count` is missing. The check runs before `array` is read.
- A negative, fractional, or non-finite `count` throws `RangeError`, even when `array` is invalid.
- `count` of `0`, or an empty array with any valid `count`, returns a new `[]`.
- A hole becomes `undefined`. Item references are preserved.
- The input is not mutated.
