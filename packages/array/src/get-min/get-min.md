# `getMin`

Returns the item that is strictly smallest. The result is the item, not the number extracted by `by`.

Ties keep the earlier item. A candidate replaces the champion only when `candidate < champion`.

## Import

```ts
import { getMin } from "@sgx4u/array";
```

## Signature

```ts
function getMin<Item>(array: readonly Item[]): Item | undefined;
function getMin<Item>(params: GetMinParams<Item>): Item | undefined;
```

`GetMinParams` is `{ array, by? }`. A bare array is the same as `{ array }`.

## Parameters

| Name    | Description                                                                                                                                                                              |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `array` | Items to compare.                                                                                                                                                                        |
| `by`    | Optional property key or function. When set, items are compared by the finite numbers it returns. When omitted, the items themselves are compared with `<` and non-numbers do not throw. |

## Examples

```ts
getMin([3, 1, 2]); // 1
getMin({ array: [{ n: 3 }, { n: 1 }], by: "n" }); // { n: 1 }
getMin([]); // undefined
```

## Edge cases

| Input                                          | Result                      |
| ---------------------------------------------- | --------------------------- |
| `[]`, or `array` is not an array               | `undefined`                 |
| Two items compare equal                        | The earlier item            |
| `by` is omitted and an item is not a number    | Compared with `<`. No throw |
| `by` is set and a value is not a finite number | Throws `TypeError`          |
| `by` is not an iteratee                        | Throws `TypeError`          |

The input array is not mutated.
