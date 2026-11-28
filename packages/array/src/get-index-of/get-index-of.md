# `getIndexOf`

Returns the first index of `value`, searching forward from `fromIndex`. Comparison is SameValueZero unless `equals` is set: `NaN` matches `NaN`, and `-0` matches `0`. A negative `fromIndex` counts from the end and is clamped to `0`. A non-integer `fromIndex` returns `undefined`. A missing match returns `undefined`, not `-1`. The array is not mutated.

## Import

```ts
import { getIndexOf, type GetIndexOfParams } from "@sgx4u/array";
```

## Signature

```ts
function getIndexOf<Item>(params: GetIndexOfParams<Item>): number | undefined;
```

## Parameters

| Parameter   | Type              | Default       | Description                                                       |
| ----------- | ----------------- | ------------- | ----------------------------------------------------------------- |
| `array`     | `readonly Item[]` |               | The array to search. A non-array returns `undefined`.             |
| `value`     | `Item`            |               | The value to find.                                                |
| `equals`    | `Equals<Item>`    | SameValueZero | Compares `(item, value)`. A non-function throws.                  |
| `fromIndex` | `number`          | `0`           | Start index. Negative values count from the end and clamp to `0`. |

## Examples

```ts
getIndexOf({ array: [1, 2, 1], value: 1 }); // 0
getIndexOf({ array: [1, Number.NaN], value: Number.NaN }); // 1
getIndexOf({ array: [-0], value: 0 }); // 0
getIndexOf({ array: [1, 2, 1], value: 1, fromIndex: 1 }); // 2
```

## Edge cases

| Call                                                        | Result          |
| ----------------------------------------------------------- | --------------- |
| no match, or an empty array                                 | `undefined`     |
| a match at index `0`                                        | `0`             |
| `NaN` searched with the default equality                    | the `NaN` index |
| `-0` searched as `0`                                        | a match         |
| `equals: Object.is` for `-0` and `0`                        | `undefined`     |
| `fromIndex` before the start                                | clamped to `0`  |
| a non-integer `fromIndex`                                   | `undefined`     |
| a hole, when searching for `undefined`                      | that index      |
| `null`, `{}`, `"text"`, a typed array, a `Set`, a generator | `undefined`     |

`equals` is checked before `array`. A non-function throws `TypeError` even when `array` is not an array:

```text
`equals` must be a function; received "no".
```
