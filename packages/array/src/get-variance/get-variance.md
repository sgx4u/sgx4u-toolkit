# `getVariance`

Returns the variance of the finite numbers in an array.

The default is the population variance: the mean of the squared distances from the mean, divided by `n`. One item then returns `0`. `sample: true` divides by `n - 1` and returns `undefined` when fewer than two items are present.

## Import

```ts
import { getVariance } from "@sgx4u/array";
```

## Signature

```ts
function getVariance<Item>(params: GetVarianceParams<Item>): number | undefined;
```

## Parameters

| Name     | Description                                                     |
| -------- | --------------------------------------------------------------- |
| `array`  | Values to measure.                                              |
| `by`     | Optional property key or function that returns a finite number. |
| `sample` | When `true`, divide by `n - 1`. Defaults to `false`.            |

## Examples

```ts
getVariance({ array: [1, 2, 3] }); // 2 / 3
getVariance({ array: [1, 2, 3], sample: true }); // 1
getVariance({ array: [5] }); // 0
getVariance({ array: [5], sample: true }); // undefined
```

## Edge cases

| Input                                         | Result             |
| --------------------------------------------- | ------------------ |
| `[]`, or `array` is not an array              | `undefined`        |
| One item, population variance                 | `0`                |
| Fewer than two items, `sample: true`          | `undefined`        |
| `sample` is not a boolean                     | Throws `TypeError` |
| An item or `by` result is not a finite number | Throws `TypeError` |

The input array is not mutated.
