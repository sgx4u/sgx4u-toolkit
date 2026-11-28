# `createRange`

Builds a numeric range. `createRange(3)` is `[0, 1, 2]`. The function never returns `undefined`. A bad argument throws.

Values are `start + index * step`. The walk stops before passing `end`. `inclusive: true` also keeps the last value when it is within a small tolerance of `end`, or when `(end - start) / step` is nearly an integer.

## Import

```ts
import { createRange } from "@sgx4u/array";
```

## Signature

```ts
function createRange(end: number): number[];
function createRange(params: CreateRangeParams): number[];
```

## Parameters

| Name        | Type      | Default | Description                                                       |
| ----------- | --------- | ------- | ----------------------------------------------------------------- |
| `end`       | `number`  |         | Exclusive end. `createRange(end)` starts at `0` and steps by `1`. |
| `start`     | `number`  | `0`     | First value.                                                      |
| `step`      | `number`  | `1`     | Distance between values. A negative step counts down. `0` throws. |
| `inclusive` | `boolean` | `false` | Include `end` when it lands on a step.                            |

## Examples

```ts
createRange(3); // [0, 1, 2]
createRange({ start: 1, end: 4 }); // [1, 2, 3]
createRange({ start: 0, end: 3, inclusive: true }); // [0, 1, 2, 3]
createRange({ start: 5, end: 1, step: -1 }); // [5, 4, 3, 2]
createRange({ start: 0, end: 5, step: -1 }); // []
```

## Edge cases

- A step whose sign points away from `end` returns `[]`. `createRange(-3)` is `[]`.
- `start === end` returns `[]`, or `[start]` when `inclusive` is true.
- `step` of `0` throws `RangeError`.
- A bound that is not a number throws `TypeError`. `null`, `{}`, and a string take this path.
- `NaN` or an infinity throws `RangeError`.
- A range longer than `1_000_000` values throws `RangeError`: `` `end` must produce a finite range ``.
- Fractional steps use index multiplication, so `0.1` and `0.2` do not drift the way repeated addition does.
