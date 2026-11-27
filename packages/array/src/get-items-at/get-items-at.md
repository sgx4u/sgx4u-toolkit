# `getItemsAt`

Returns the items at `indexes`, in that order. A negative index counts from the end. An out-of-range index and a non-integer are skipped. Duplicates are kept. A hole is returned as `undefined` and is not skipped. The result is a new array. Neither array is mutated. When the argument is a params object, `indexes` is checked before `array`.

## Import

```ts
import { getItemsAt, type GetItemsAtParams } from "@sgx4u/array";
```

## Signature

```ts
function getItemsAt<Item>(params: GetItemsAtParams<Item>): Item[] | undefined;
```

## Parameters

| Parameter | Type                 | Description                                                   |
| --------- | -------------------- | ------------------------------------------------------------- |
| `array`   | `readonly Item[]`    | The array to read. A non-array returns `undefined`.           |
| `indexes` | `readonly unknown[]` | Positions to read. Must be an array. Bad entries are skipped. |

## Examples

```ts
getItemsAt({ array: ["a", "b", "c"], indexes: [2, 0, 0] }); // ["c", "a", "a"]
getItemsAt({ array: ["a", "b", "c"], indexes: [-1, 5, 1.5] }); // ["c"]
```

## Edge cases

| Call                                            | Result                  |
| ----------------------------------------------- | ----------------------- |
| duplicate indexes                               | the item is repeated    |
| a negative index                                | counted from the end    |
| an out-of-range index                           | skipped                 |
| a non-integer, including a string               | skipped                 |
| an empty `indexes` array                        | a new `[]`              |
| a hole                                          | `undefined` is included |
| `null`, `"text"`                                | `undefined`             |
| a non-array `array` with a real `indexes` array | `undefined`             |
| `indexes` that is not an array                  | throws `TypeError`      |

`{}`, a typed array, a `Set`, and a generator throw because `indexes` is missing. A bad `indexes` throws even when `array` is not an array.

```text
`indexes` must be an array; received "no".
```
