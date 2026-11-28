# `dropLast`

Returns the items before the last `count` items. Skipping more items than the array holds returns a new empty array. `count` of `0` returns a copy of every item. The result is a new dense array. The input is not mutated. When the argument is a params object, `count` is checked before `array`.

## Import

```ts
import { dropLast, type DropLastParams } from "@sgx4u/array";
```

## Signature

```ts
function dropLast<Item>(params: DropLastParams<Item>): Item[] | undefined;
```

## Parameters

| Parameter | Type              | Description                                                                     |
| --------- | ----------------- | ------------------------------------------------------------------------------- |
| `array`   | `readonly Item[]` | The array to copy from. A non-array returns `undefined`.                        |
| `count`   | `number`          | How many trailing items to skip. A finite integer greater than or equal to `0`. |

## Examples

```ts
dropLast({ array: [1, 2, 3], count: 1 }); // [1, 2]
dropLast({ array: [1, 2], count: 0 }); // [1, 2]
dropLast({ array: [1, 2], count: 10 }); // []
```

## Edge cases

| Call                                          | Result                   |
| --------------------------------------------- | ------------------------ |
| `count` of `0`                                | a new copy of every item |
| `count` past the start                        | a new `[]`               |
| an empty array                                | a new `[]`               |
| a sparse array                                | holes become `undefined` |
| `null`, `"text"`                              | `undefined`              |
| a missing or non-numeric `count`              | throws `TypeError`       |
| a negative, fractional, or non-finite `count` | throws `RangeError`      |

`{}`, a typed array, a `Set`, and a generator throw because `count` is missing.
