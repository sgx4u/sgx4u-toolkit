# `repeatItem`

Returns `count` copies of the same item reference. Objects are not cloned. The function never returns `undefined`. `count` of `0` returns `[]`.

## Import

```ts
import { repeatItem } from "@sgx4u/array";
```

## Signature

```ts
function repeatItem<Item>(params: RepeatItemParams<Item>): Item[];
```

## Parameters

| Name    | Type     | Description                                                                      |
| ------- | -------- | -------------------------------------------------------------------------------- |
| `item`  | `Item`   | Value stored in every slot. The same reference is reused.                        |
| `count` | `number` | How many copies to store. Must be a finite integer greater than or equal to `0`. |

## Examples

```ts
repeatItem({ item: "a", count: 3 }); // ["a", "a", "a"]
repeatItem({ item: 1, count: 0 }); // []
```

## Edge cases

- `count` of `0` returns `[]`.
- `null`, `{}`, a string, a typed array, or a `Set` throws `TypeError` because `count` is missing or the argument is not a params object.
- A negative, fractional, or non-finite `count` throws `RangeError`.
- Every slot is the same reference. The result is a new array.
