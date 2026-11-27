# `getOffsetItems`

Returns a dense slice starting at `offset`. `0` is the first item. `limit` of `0` returns `[]`. An offset past the end returns `[]` when the array is valid.

## Import

```ts
import { getOffsetItems } from "@sgx4u/array";
```

## Signature

```ts
function getOffsetItems<Item>(
    params: GetOffsetItemsParams<Item>,
): Item[] | undefined;
```

## Parameters

| Name     | Description                                                           |
| -------- | --------------------------------------------------------------------- |
| `array`  | Items to slice.                                                       |
| `offset` | Index of the first item. A finite integer greater than or equal to 0. |
| `limit`  | Maximum number of items. A finite integer greater than or equal to 0. |

## Examples

```ts
getOffsetItems({ array: ["a", "b", "c"], offset: 1, limit: 2 }); // ["b", "c"]
getOffsetItems({ array: ["a"], offset: 0, limit: 0 }); // []
getOffsetItems({ array: ["a"], offset: 4, limit: 1 }); // []
```

## Edge cases

| Input                                                      | Result                                   |
| ---------------------------------------------------------- | ---------------------------------------- |
| `array` is not an array                                    | `undefined`                              |
| `limit` is `0`                                             | `[]`                                     |
| `offset` is past the end                                   | `[]`                                     |
| `offset` or `limit` is negative, fractional, or not finite | Throws `RangeError`                      |
| `offset` or `limit` is not a number                        | Throws `TypeError`                       |
| A sparse hole                                              | The hole is `undefined` in a dense array |

The result is a new array. The input is not mutated.
