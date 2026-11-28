# `splitAt`

Splits an array into the items before `index` and the items from `index` onward. A negative index counts from the end. The index is clamped into `0..length`, so an index past either end does not throw. A finite non-integer is truncated toward zero before that clamp. An index equal to the length returns the dense copy and a new empty array. Both sides are new arrays. The input is not mutated. `index` is checked before `array`.

## Import

```ts
import { splitAt, type SplitAtParams } from "@sgx4u/array";
```

## Signature

```ts
function splitAt<Item>(
    params: SplitAtParams<Item>,
): [Item[], Item[]] | undefined;
```

## Parameters

| Parameter | Type              | Description                                            |
| --------- | ----------------- | ------------------------------------------------------ |
| `array`   | `readonly Item[]` | The array to split. A non-array returns `undefined`.   |
| `index`   | `number`          | Where the right side starts. Clamped into `0..length`. |

## Examples

```ts
splitAt({ array: [1, 2, 3, 4], index: 2 }); // [[1, 2], [3, 4]]
splitAt({ array: [1, 2, 3, 4], index: -1 }); // [[1, 2, 3], [4]]
splitAt({ array: [1, 2, 3, 4], index: 4 }); // [[1, 2, 3, 4], []]
splitAt({ array: [1, 2, 3, 4], index: 1.9 }); // [[1], [2, 3, 4]]
```

## Edge cases

| Call                               | Result                   |
| ---------------------------------- | ------------------------ |
| `index` of `0`                     | `[[], copy]`             |
| `index` equal to the length        | `[copy, []]`             |
| `index` past either end            | clamped, no throw        |
| an empty array                     | `[[], []]`               |
| a sparse array                     | holes become `undefined` |
| `null`, `"text"`, `{ index: 1 }`   | `undefined`              |
| a missing `index`, or a non-number | throws `TypeError`       |
| `NaN` or an infinity               | throws `RangeError`      |

`{}`, a typed array, a `Set`, and a generator throw because `index` is missing.

```text
`index` must be a finite number; received NaN.
```
