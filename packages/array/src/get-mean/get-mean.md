# `getMean`

Returns the arithmetic mean of the finite numbers in an array.

## Import

```ts
import { getMean } from "@sgx4u/array";
```

## Signature

```ts
function getMean<Item>(params: GetMeanParams<Item>): number | undefined;
```

## Parameters

| Name    | Description                                                     |
| ------- | --------------------------------------------------------------- |
| `array` | Values to average.                                              |
| `by`    | Optional property key or function that returns a finite number. |

## Examples

```ts
getMean({ array: [1, 2, 3, 4] }); // 2.5
getMean({ array: [] }); // undefined
```

## Edge cases

| Input                                         | Result             |
| --------------------------------------------- | ------------------ |
| `[]`, or `array` is not an array              | `undefined`        |
| One item                                      | That number        |
| An item or `by` result is not a finite number | Throws `TypeError` |
| `by` is not an iteratee                       | Throws `TypeError` |

The input array is not mutated.
