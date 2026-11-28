# `fillRange`

Fills a range of a new array. The input is not mutated. Index rules match `Array#fill`: negative indexes count from the end, bounds are clamped, and a fractional bound is truncated toward zero.

## Import

```ts
import { fillRange } from "@sgx4u/array";
```

## Signature

```ts
function fillRange<Item>(params: FillRangeParams<Item>): Item[] | undefined;
```

## Parameters

| Name    | Type              | Default    | Description                   |
| ------- | ----------------- | ---------- | ----------------------------- |
| `array` | `readonly Item[]` |            | Source array.                 |
| `value` | `Item`            |            | Value written into the range. |
| `start` | `number`          | `0`        | First index to fill.          |
| `end`   | `number`          | The length | Index at which filling stops. |

## Examples

```ts
fillRange({ array: [1, 2, 3], value: 0 }); // [0, 0, 0]
fillRange({ array: [1, 2, 3, 4], value: 9, start: 1, end: 3 }); // [1, 9, 9, 4]
fillRange({ array: [1, 2, 3, 4], value: 9, start: -2 }); // [1, 2, 9, 9]
```

## Edge cases

- `null`, `{}`, a string, a typed array, a `Set`, or a generator returns `undefined`.
- Omitted `start` and `end` do not throw. The whole copy is filled.
- A present `start` or `end` that is not a number throws `TypeError`.
- A present bound that is `NaN` or an infinity throws `RangeError`. The check runs even when `array` is invalid.
- A start past the end fills nothing and returns a shallow copy of the values.
- A frozen array is not mutated. `fill` runs on the copy only.
- A hole outside the filled range becomes `undefined`.
