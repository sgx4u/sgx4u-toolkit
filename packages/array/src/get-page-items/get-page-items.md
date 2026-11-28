# `getPageItems`

Returns only the items on one page. `page` is 1-based. A page past the end returns `[]` when the array is valid, not `undefined`.

## Import

```ts
import { getPageItems } from "@sgx4u/array";
```

## Signature

```ts
function getPageItems<Item>(
    params: GetPageItemsParams<Item>,
): Item[] | undefined;
```

## Parameters

| Name       | Description                                                       |
| ---------- | ----------------------------------------------------------------- |
| `array`    | Items to page.                                                    |
| `page`     | 1-based page number. A finite integer greater than or equal to 1. |
| `pageSize` | Maximum items on a page. A positive integer.                      |

## Examples

```ts
getPageItems({ array: ["a", "b", "c"], page: 2, pageSize: 2 }); // ["c"]
getPageItems({ array: ["a"], page: 3, pageSize: 1 }); // []
```

## Edge cases

| Input                                 | Result                                   |
| ------------------------------------- | ---------------------------------------- |
| `array` is not an array               | `undefined`                              |
| Page past the end, or an empty source | `[]`                                     |
| `page` is less than 1                 | Throws `RangeError`                      |
| `page` is not a finite integer        | Throws `TypeError` or `RangeError`       |
| `pageSize` is not a positive integer  | Throws `TypeError` or `RangeError`       |
| A sparse hole                         | The hole is `undefined` in a dense array |

The result is a new array. The input is not mutated.
