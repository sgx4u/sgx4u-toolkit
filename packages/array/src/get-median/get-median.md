# `getMedian`

Returns the median of the finite numbers in an array. The numbers are sorted on a copy.

An odd count returns the middle number. An even count returns the mean of the two central numbers.

## Import

```ts
import { getMedian } from "@sgx4u/array";
```

## Signature

```ts
function getMedian<Item>(params: GetMedianParams<Item>): number | undefined;
```

## Parameters

| Name    | Description                                                     |
| ------- | --------------------------------------------------------------- |
| `array` | Values to rank.                                                 |
| `by`    | Optional property key or function that returns a finite number. |

## Examples

```ts
getMedian({ array: [3, 1, 2] }); // 2
getMedian({ array: [1, 2, 3, 4] }); // 2.5
getMedian({ array: [] }); // undefined
```

## Edge cases

| Input                                         | Result             |
| --------------------------------------------- | ------------------ |
| `[]`, or `array` is not an array              | `undefined`        |
| One item                                      | That number        |
| An item or `by` result is not a finite number | Throws `TypeError` |

The input array is not mutated. Sorting uses a copy.
