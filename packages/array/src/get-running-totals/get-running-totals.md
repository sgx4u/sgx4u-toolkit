# `getRunningTotals`

Returns the inclusive prefix sums of the finite numbers in an array.

## Import

```ts
import { getRunningTotals } from "@sgx4u/array";
```

## Signature

```ts
function getRunningTotals<Item>(
    params: GetRunningTotalsParams<Item>,
): number[] | undefined;
```

## Parameters

| Name    | Description                                                     |
| ------- | --------------------------------------------------------------- |
| `array` | Values to accumulate.                                           |
| `by`    | Optional property key or function that returns a finite number. |

## Examples

```ts
getRunningTotals({ array: [1, 2, 3] }); // [1, 3, 6]
getRunningTotals({ array: [] }); // undefined
```

## Edge cases

| Input                                         | Result                |
| --------------------------------------------- | --------------------- |
| `[]`, or `array` is not an array              | `undefined`, not `[]` |
| An item or `by` result is not a finite number | Throws `TypeError`    |
| `by` is not an iteratee                       | Throws `TypeError`    |

The result is a new array. The input is not mutated.
