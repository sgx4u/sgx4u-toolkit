# `withoutValues`

Copies `array` without the items that appear in `values`. Duplicates that are not excluded stay, in the original order. This is not a unique. The result is always a new array. `values` must be an array.

## Import

```ts
import { withoutValues, type WithoutValuesParams } from "@sgx4u/array";
```

## Signature

```ts
function withoutValues<Item>(
    params: WithoutValuesParams<Item>,
): Item[] | undefined;
```

## Parameters

| Name     | Type              | Default       | Description                       |
| -------- | ----------------- | ------------- | --------------------------------- |
| `array`  | `readonly Item[]` |               | Items to filter.                  |
| `values` | `readonly Item[]` |               | Values to remove.                 |
| `equals` | `Equals<Item>`    | SameValueZero | Equality for an item and a value. |

## Examples

```ts
withoutValues({ array: [1, 2, 2, 3, 1], values: [2] });
// [1, 3, 1]
```

## Edge cases

- A non-array `values` returns `undefined`. A non-array `array` returns `undefined`.
- A non-function `equals` throws `TypeError` before the arrays are checked.
- An empty `values` list returns a copy of `array`.
- `NaN` matches `NaN`, and `-0` matches `0`. Holes are `undefined`. The inputs are not mutated.
