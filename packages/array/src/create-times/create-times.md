# `createTimes`

Builds `[0, 1, ..., count - 1]`, or the values returned by `mapper`. The function never returns `undefined`. `count` of `0` returns `[]`.

## Import

```ts
import { createTimes } from "@sgx4u/array";
```

## Signature

```ts
function createTimes(params: { count: number }): number[];
function createTimes<Item>(params: CreateTimesParams<Item>): Item[];
```

## Parameters

| Name     | Type                      | Description                                                                      |
| -------- | ------------------------- | -------------------------------------------------------------------------------- |
| `count`  | `number`                  | How many values to build. Must be a finite integer greater than or equal to `0`. |
| `mapper` | `(index: number) => Item` | Maps an index. When omitted, the result is the indexes.                          |

## Examples

```ts
createTimes({ count: 4 }); // [0, 1, 2, 3]
createTimes({ count: 0 }); // []
createTimes({ count: 3, mapper: (index) => index * 2 }); // [0, 2, 4]
```

## Edge cases

- `count` of `0` returns `[]`.
- A missing `count`, `null`, `{}`, or a string throws `TypeError`.
- A negative, fractional, or non-finite `count` throws `RangeError`.
- A present `mapper` that is not a function throws `TypeError`.
- The result is always a new array.
