# `getPercentile`

Returns a percentile of the finite numbers in an array. The numbers are sorted on a copy. The rank is `(percentile / 100) * (length - 1)`.

`"linear"` (the default) interpolates between the floor and the ceiling. `"nearest"` uses `Math.round` on the rank. One item returns that number for every percentile from 0 through 100.

## Import

```ts
import { getPercentile } from "@sgx4u/array";
```

## Signature

```ts
function getPercentile<Item>(
    params: GetPercentileParams<Item>,
): number | undefined;
```

## Parameters

| Name         | Description                                                     |
| ------------ | --------------------------------------------------------------- |
| `array`      | Values to rank.                                                 |
| `percentile` | A finite number from 0 through 100, inclusive.                  |
| `by`         | Optional property key or function that returns a finite number. |
| `method`     | `"linear"` or `"nearest"`. Defaults to `"linear"`.              |

## Examples

```ts
getPercentile({ array: [1, 2, 3, 4], percentile: 50 }); // 2.5
getPercentile({ array: [1, 2, 3, 4], percentile: 50, method: "nearest" }); // 3
getPercentile({ array: [9], percentile: 10 }); // 9
```

## Edge cases

| Input                                                | Result                     |
| ---------------------------------------------------- | -------------------------- |
| `[]`, or `array` is not an array                     | `undefined`                |
| `percentile` is `0` or `100`                         | The minimum or the maximum |
| `percentile` is outside 0 through 100, or not finite | Throws `RangeError`        |
| `percentile` is not a number                         | Throws `TypeError`         |
| `method` is not `"linear"` or `"nearest"`            | Throws `RangeError`        |
| An item or `by` result is not a finite number        | Throws `TypeError`         |

The input array is not mutated.
