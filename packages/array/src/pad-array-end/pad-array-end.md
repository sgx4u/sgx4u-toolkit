# `padArrayEnd`

Pads the end of a new array with `value` until the array reaches `length`. The input is not mutated. A source that is already at least `length` is copied unchanged.

## Import

```ts
import { padArrayEnd } from "@sgx4u/array";
```

## Signature

```ts
function padArrayEnd<Item>(params: PadArrayEndParams<Item>): Item[] | undefined;
```

## Parameters

| Name     | Type              | Description                                                                |
| -------- | ----------------- | -------------------------------------------------------------------------- |
| `array`  | `readonly Item[]` | Source array.                                                              |
| `length` | `number`          | Length of the result. Must be a finite integer greater than or equal to 0. |
| `value`  | `Item`            | Value repeated at the end. The same reference is stored in each pad slot.  |

## Examples

```ts
padArrayEnd({ array: [1, 2], length: 4, value: 0 }); // [1, 2, 0, 0]
padArrayEnd({ array: [1, 2, 3], length: 2, value: 0 }); // [1, 2, 3]
padArrayEnd({ array: [], length: 2, value: 1 }); // [1, 1]
```

## Edge cases

- `null`, `{}`, a string, a typed array, a `Set`, or a generator returns `undefined`.
- `length` equal to the current length, or smaller, returns a shallow copy.
- `length` of `0` on an empty array returns a new `[]`.
- A present `length` that is negative, fractional, or not finite throws `RangeError`.
- A present `length` that is not a number throws `TypeError`. The check runs even when `array` is invalid.
- A real array that omits `length` throws `TypeError`.
- A frozen array is not mutated. The result is a new array.
- A hole becomes `undefined` before the padding.
