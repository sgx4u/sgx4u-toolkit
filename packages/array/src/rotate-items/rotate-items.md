# `rotateItems`

Rotates items by a finite integer count and returns a new array. The input is not mutated.

A positive count moves items toward the end. A negative count moves items toward the start. The distance is `count` modulo the length. The last `normalized` items move to the front, where `normalized` is `((count % length) + length) % length`.

## Import

```ts
import { rotateItems } from "@sgx4u/array";
```

## Signature

```ts
function rotateItems<Item>(params: RotateItemsParams<Item>): Item[] | undefined;
```

## Parameters

| Name    | Type              | Description                               |
| ------- | ----------------- | ----------------------------------------- |
| `array` | `readonly Item[]` | Source array.                             |
| `count` | `number`          | Rotation distance. Negatives are allowed. |

## Examples

```ts
rotateItems({ array: [1, 2, 3], count: 1 }); // [3, 1, 2]
rotateItems({ array: [1, 2, 3], count: -1 }); // [2, 3, 1]
rotateItems({ array: [1, 2, 3], count: 3 }); // [1, 2, 3]
rotateItems({ array: [], count: 4 }); // []
```

## Edge cases

- `null`, `{}`, a string, a typed array, a `Set`, or a generator returns `undefined`.
- An empty array returns a new `[]` for any finite integer `count`. The length is never used as a divisor.
- A normalized distance of `0`, including `count` of `0`, returns a shallow copy.
- Rotating by `count` and then by `-count` restores the original items in a new array.
- A present `count` that is not a finite integer throws. A non-number is `TypeError`. A non-integer number is `RangeError`. The check runs even when `array` is invalid.
- A real array that omits `count` throws `TypeError`.
- A frozen array is not mutated. The result is a new array.
- A hole becomes `undefined` in the result.
