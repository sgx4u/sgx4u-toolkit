# `getStandardDeviation`

Returns the square root of the variance. The `sample` rule matches `getVariance`: population variance by default, and `undefined` when a sample variance needs two items and fewer are present.

## Import

```ts
import { getStandardDeviation } from "@sgx4u/array";
```

## Signature

```ts
function getStandardDeviation<Item>(
    params: GetStandardDeviationParams<Item>,
): number | undefined;
```

## Parameters

| Name     | Description                                                     |
| -------- | --------------------------------------------------------------- |
| `array`  | Values to measure.                                              |
| `by`     | Optional property key or function that returns a finite number. |
| `sample` | When `true`, use the sample variance. Defaults to `false`.      |

## Examples

```ts
getStandardDeviation({ array: [1, 2, 3], sample: true }); // 1
getStandardDeviation({ array: [4] }); // 0
getStandardDeviation({ array: [] }); // undefined
```

## Edge cases

| Input                                         | Result             |
| --------------------------------------------- | ------------------ |
| The variance is `undefined`                   | `undefined`        |
| `[]`, or `array` is not an array              | `undefined`        |
| One item, population                          | `0`                |
| Fewer than two items, `sample: true`          | `undefined`        |
| An item or `by` result is not a finite number | Throws `TypeError` |
| `sample` is not a boolean                     | Throws `TypeError` |

The input array is not mutated.
