# `getMax`

Returns the item that is strictly largest. The result is the item, not the number extracted by `by`.

Ties keep the earlier item. A candidate replaces the champion only when `candidate > champion`.

## Import

```ts
import { getMax } from "@sgx4u/array";
```

## Signature

```ts
function getMax<Item>(array: readonly Item[]): Item | undefined;
function getMax<Item>(params: GetMaxParams<Item>): Item | undefined;
```

`GetMaxParams` is `{ array, by? }`. A bare array is the same as `{ array }`.

## Parameters

| Name    | Description                                                                                                                                                                              |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `array` | Items to compare.                                                                                                                                                                        |
| `by`    | Optional property key or function. When set, items are compared by the finite numbers it returns. When omitted, the items themselves are compared with `>` and non-numbers do not throw. |

## Examples

```ts
getMax([3, 1, 2]); // 3
getMax({ array: [{ n: 3 }, { n: 1 }], by: "n" }); // { n: 3 }
getMax([]); // undefined
```

## Edge cases

| Input                                          | Result                      |
| ---------------------------------------------- | --------------------------- |
| `[]`, or `array` is not an array               | `undefined`                 |
| Two items compare equal                        | The earlier item            |
| `by` is omitted and an item is not a number    | Compared with `>`. No throw |
| `by` is set and a value is not a finite number | Throws `TypeError`          |
| `by` is not an iteratee                        | Throws `TypeError`          |

The input array is not mutated.
