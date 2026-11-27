# `drop`

Returns the items after skipping the first `count` items. Skipping more items than the array holds returns a new empty array. `count` of `0` returns a copy of every item. The result is a new dense array. The input is not mutated. When the argument is a params object, `count` is checked before `array`.

## Import

```ts
import { drop, type DropParams } from "@sgx4u/array";
```

## Signature

```ts
function drop<Item>(params: DropParams<Item>): Item[] | undefined;
```

## Parameters

| Parameter | Type              | Description                                                                    |
| --------- | ----------------- | ------------------------------------------------------------------------------ |
| `array`   | `readonly Item[]` | The array to copy from. A non-array returns `undefined`.                       |
| `count`   | `number`          | How many leading items to skip. A finite integer greater than or equal to `0`. |

## Examples

```ts
drop({ array: [1, 2, 3], count: 1 }); // [2, 3]
drop({ array: [1, 2], count: 0 }); // [1, 2]
drop({ array: [1, 2], count: 10 }); // []
```

## Edge cases

| Call                                          | Result                   |
| --------------------------------------------- | ------------------------ |
| `count` of `0`                                | a new copy of every item |
| `count` past the end                          | a new `[]`               |
| an empty array                                | a new `[]`               |
| a sparse array                                | holes become `undefined` |
| `null`, `"text"`                              | `undefined`              |
| a missing or non-numeric `count`              | throws `TypeError`       |
| a negative, fractional, or non-finite `count` | throws `RangeError`      |

`{}`, a typed array, a `Set`, and a generator throw because `count` is missing.
