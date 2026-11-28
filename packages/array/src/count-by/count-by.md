# `countBy`

Counts items by `String(by(item))` and keeps the first-seen key order. Distinct objects share `"[object Object]"`. `NaN` counts with `NaN` because both stringify to `"NaN"`. `-0` counts with `0` because both stringify to `"0"`. A symbol uses `Symbol.prototype.toString`.

Integer-like keys are enumerated in numeric order by JavaScript. Every other string key stays in first-seen order.

## Import

```ts
import { countBy, type CountByParams } from "@sgx4u/array";
```

## Signature

```ts
function countBy<Item>(
    params: CountByParams<Item>,
): Record<string, number> | undefined;
```

## Parameters

| Name    | Type              | Description                                       |
| ------- | ----------------- | ------------------------------------------------- |
| `array` | `readonly Item[]` | Items to count.                                   |
| `by`    | `Iteratee<Item>`  | Property key or function that chooses the bucket. |

## Examples

```ts
countBy({ array: ["red", "blue", "red"], by: (item) => item });
// { red: 2, blue: 1 }
```

## Edge cases

- A non-object returns `undefined`. A non-array `array` returns `undefined` when `by` is valid.
- An invalid `by` throws `TypeError` before the array is checked.
- An empty array returns `{}`.
- Holes are counted under the key `"undefined"`. The input is not mutated.
