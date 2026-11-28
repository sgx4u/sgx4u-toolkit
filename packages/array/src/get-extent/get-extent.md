# `getExtent`

Returns the first minimum item and the first maximum item as `{ min, max }`.

Ties keep the earlier item. When `by` is omitted, items are compared with `<` and `>`. When `by` is set, the finite numbers are compared and the result is still the items.

## Import

```ts
import { getExtent } from "@sgx4u/array";
```

## Signature

```ts
function getExtent<Item>(
    params: GetExtentParams<Item>,
): Extent<Item> | undefined;
```

`Extent` is `{ min: Item; max: Item }`.

## Parameters

| Name    | Description                                                                 |
| ------- | --------------------------------------------------------------------------- |
| `array` | Items to compare.                                                           |
| `by`    | Optional property key or function. Omit it to compare the items themselves. |

## Examples

```ts
getExtent({ array: [2, 1, 3, 1] }); // { min: 1, max: 3 }
getExtent({ array: [] }); // undefined
```

## Edge cases

| Input                                          | Result                              |
| ---------------------------------------------- | ----------------------------------- |
| `[]`, or `array` is not an array               | `undefined`                         |
| Equal minimums or maximums                     | The earlier item                    |
| `by` is omitted and an item is not a number    | Compared with `<` and `>`. No throw |
| `by` is set and a value is not a finite number | Throws `TypeError`                  |

The input array is not mutated.
