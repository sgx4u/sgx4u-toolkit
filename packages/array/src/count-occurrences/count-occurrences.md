# `countOccurrences`

Counts items equal to `value`. The default comparison is SameValueZero, so `NaN` equals `NaN` and `-0` equals `0`. A custom `equals` replaces that comparison.

## Import

```ts
import { countOccurrences, type CountOccurrencesParams } from "@sgx4u/array";
```

## Signature

```ts
function countOccurrences<Item>(
    params: CountOccurrencesParams<Item>,
): number | undefined;
```

## Parameters

| Name     | Type              | Default       | Description                       |
| -------- | ----------------- | ------------- | --------------------------------- |
| `array`  | `readonly Item[]` |               | Items to scan.                    |
| `value`  | `Item`            |               | The value to count.               |
| `equals` | `Equals<Item>`    | SameValueZero | Equality for `value` and an item. |

## Examples

```ts
countOccurrences({ array: [1, 2, 1], value: 1 });
// 2
```

## Edge cases

- A non-object returns `undefined`. A non-array `array` returns `undefined` when `equals` is omitted or is a function.
- A present `equals` that is not a function throws `TypeError` before `array` is checked.
- An empty array, or a value that never matches, returns `0`.
- Holes count as `undefined`. The input is not mutated.
