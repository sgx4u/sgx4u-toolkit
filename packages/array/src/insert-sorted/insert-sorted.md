# `insertSorted`

Copies `array` and inserts `value` at the bisect-left index. Equal values are inserted before the existing matches. The array is assumed sorted ascending, with nullish keys and `NaN` last. The input is not mutated.

A function `by` is called with the item, index `0`, and a one-element array.

## Import

```ts
import { insertSorted, type InsertSortedParams } from "@sgx4u/array";
```

## Signature

```ts
function insertSorted<Item>(
    params: InsertSortedParams<Item>,
): Item[] | undefined;
```

## Parameters

| Name      | Type                          | Default            | Description                                          |
| --------- | ----------------------------- | ------------------ | ---------------------------------------------------- |
| `array`   | `readonly Item[]`             |                    | A sorted array.                                      |
| `value`   | `Item`                        |                    | The value to insert.                                 |
| `by`      | `Iteratee<Item>`              | the item           | Property key or function.                            |
| `locale`  | `string \| readonly string[]` | the runtime locale | Use the locale the array was sorted with.            |
| `numeric` | `boolean`                     | `false`            | When `true`, number-like strings compare as numbers. |

## Examples

```ts
insertSorted({ array: [1, 3, 5], value: 4 });
// [1, 3, 4, 5]
```

## Edge cases

- A non-array returns `undefined`. `null`, `{}`, a string, a `Uint8Array`, a `Set`, and a generator return `undefined`.
- An invalid `by`, `numeric`, or `locale` throws before `array` is checked.
- An empty array returns a new one-item array. The result is never the input reference.
- Holes are read as `undefined`. The direction is ascending and `nulls` is `"last"`.
