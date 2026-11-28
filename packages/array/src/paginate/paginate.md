# `paginate`

Returns one page of items plus the metadata for a pager. `page` is 1-based.

`pageCount` is `0` when the source is empty, and otherwise `Math.ceil(totalCount / pageSize)`. `offset` is `(page - 1) * pageSize`. `hasPreviousPage` is `page > 1 && totalCount > 0`. `hasNextPage` is `page < pageCount`.

A page past the end has `items: []` and still reports that metadata.

## Import

```ts
import { paginate } from "@sgx4u/array";
```

## Signature

```ts
function paginate<Item>(
    params: PaginateParams<Item>,
): PageResult<Item> | undefined;
```

`PageResult` is `{ items, page, pageSize, pageCount, totalCount, offset, hasPreviousPage, hasNextPage }`.

## Parameters

| Name       | Description                                                       |
| ---------- | ----------------------------------------------------------------- |
| `array`    | Items to page.                                                    |
| `page`     | 1-based page number. A finite integer greater than or equal to 1. |
| `pageSize` | Maximum items on a page. A positive integer.                      |

## Examples

```ts
paginate({ array: ["a", "b", "c", "d", "e"], page: 2, pageSize: 2 });
// items: ["c", "d"], pageCount: 3, offset: 2, hasPreviousPage: true, hasNextPage: true

paginate({ array: ["a"], page: 3, pageSize: 1 });
// items: [], pageCount: 1, offset: 2, hasNextPage: false
```

## Edge cases

| Input                                | Result                                                              |
| ------------------------------------ | ------------------------------------------------------------------- |
| `array` is not an array              | `undefined`                                                         |
| Empty source                         | `pageCount` is `0`, `items` is `[]`, both neighbour flags are false |
| Page past the end                    | `items` is `[]`. Metadata stays accurate                            |
| `pageSize` is `1`                    | One item per page, except a short last page                         |
| `page` is less than 1                | Throws `RangeError`                                                 |
| `page` is not a finite integer       | Throws `TypeError` or `RangeError`                                  |
| `pageSize` is not a positive integer | Throws `TypeError` or `RangeError`                                  |
| A sparse hole                        | The hole is an `undefined` element in a dense `items` array         |

`items` is a new array. The input is not mutated.
