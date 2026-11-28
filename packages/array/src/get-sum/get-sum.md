# `getSum`

Returns the sum of the finite numbers in an array. An empty array returns `0`.

## Import

```ts
import { getSum } from "@sgx4u/array";
```

## Signature

```ts
function getSum<Item>(params: GetSumParams<Item>): number | undefined;
```

## Parameters

| Name    | Description                                                                                                          |
| ------- | -------------------------------------------------------------------------------------------------------------------- |
| `array` | Values to add.                                                                                                       |
| `by`    | Optional property key or function that returns the number to add. Omit it when the items are already finite numbers. |

## Examples

```ts
getSum({ array: [1, 2, 3] }); // 6
getSum({ array: [] }); // 0
getSum({ array: [{ n: 1 }, { n: 2 }], by: "n" }); // 3
```

## Edge cases

| Input                                              | Result                                                              |
| -------------------------------------------------- | ------------------------------------------------------------------- |
| `[]`                                               | `0`                                                                 |
| `array` is not an array                            | `undefined`                                                         |
| An item is not a finite number and `by` is omitted | Throws `TypeError`                                                  |
| `by` is not a property key or a function           | Throws `TypeError`                                                  |
| `by` returns a non-finite value                    | Throws `TypeError`                                                  |
| A sparse hole                                      | The hole is `undefined` and throws `TypeError` when `by` is omitted |

The input array is not mutated.
