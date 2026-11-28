# `getLastIndexOf`

Returns the last index of `value`, searching backward. Comparison is SameValueZero unless `equals` is set: `NaN` matches `NaN`, and `-0` matches `0`. `fromIndex` defaults to the last index. A negative index counts from the end. An index past the end starts at the last index. An index that falls before the start, or a non-integer, returns `undefined`. A missing match returns `undefined`, not `-1`. The array is not mutated.

## Import

```ts
import { getLastIndexOf, type GetLastIndexOfParams } from "@sgx4u/array";
```

## Signature

```ts
function getLastIndexOf<Item>(
    params: GetLastIndexOfParams<Item>,
): number | undefined;
```

## Parameters

| Parameter   | Type              | Default        | Description                                           |
| ----------- | ----------------- | -------------- | ----------------------------------------------------- |
| `array`     | `readonly Item[]` |                | The array to search. A non-array returns `undefined`. |
| `value`     | `Item`            |                | The value to find.                                    |
| `equals`    | `Equals<Item>`    | SameValueZero  | Compares `(item, value)`. A non-function throws.      |
| `fromIndex` | `number`          | the last index | Start of the backward search.                         |

## Examples

```ts
getLastIndexOf({ array: [1, 2, 1, 2], value: 1 }); // 2
getLastIndexOf({ array: [1, 0, -0], value: 0 }); // 2
getLastIndexOf({ array: [1, 2, 1, 2], value: 2, fromIndex: 100 }); // 3
getLastIndexOf({ array: [1, 2, 3], value: 1, fromIndex: -10 }); // undefined
```

## Edge cases

| Call                                                        | Result                     |
| ----------------------------------------------------------- | -------------------------- |
| no match, or an empty array                                 | `undefined`                |
| a match at index `0`                                        | `0`                        |
| `NaN`                                                       | the last `NaN` index       |
| `-0` and `0` with the default equality                      | a match                    |
| `equals: Object.is` for `-0` and `0`                        | `undefined`                |
| `fromIndex` past the end                                    | search from the last index |
| `fromIndex` before the start                                | `undefined`                |
| a non-integer `fromIndex`                                   | `undefined`                |
| `null`, `{}`, `"text"`, a typed array, a `Set`, a generator | `undefined`                |

A non-function `equals` throws `TypeError` before the array is checked.
