# `takeLastWhile`

Returns the trailing run of items that satisfy `predicate`, in their original order. The scan walks from the end to find the cut, then copies that suffix. `[1, 2, 3, 4]` while `item > 2` returns `[3, 4]`. An empty array, and an array whose last item fails, return a new empty array. The input is not mutated. When the argument is a params object, `predicate` is checked before `array`.

## Import

```ts
import { takeLastWhile, type TakeLastWhileParams } from "@sgx4u/array";
```

## Signature

```ts
function takeLastWhile<Item>(
    params: TakeLastWhileParams<Item>,
): Item[] | undefined;
```

## Parameters

| Parameter   | Type              | Description                                                       |
| ----------- | ----------------- | ----------------------------------------------------------------- |
| `array`     | `readonly Item[]` | The array to copy from. A non-array returns `undefined`.          |
| `predicate` | `Predicate<Item>` | Called as `predicate(item, index, array)`. A non-function throws. |

## Examples

```ts
takeLastWhile({
    array: [1, 2, 3, 4],
    predicate: (item) => item > 2,
}); // [3, 4]

takeLastWhile({
    array: [4, 1, 3],
    predicate: (item) => item > 2,
}); // [3]
```

## Edge cases

| Call                                  | Result                   |
| ------------------------------------- | ------------------------ |
| the last item fails                   | a new `[]`               |
| every item matches                    | a new copy, not reversed |
| an empty array, or `[1]` that matches | `[]`, or `[1]`           |
| `null`, `"text"`                      | `undefined`              |
| a non-array with a valid predicate    | `undefined`              |
| `predicate` that is not a function    | throws `TypeError`       |

`{}`, a typed array, a `Set`, and a generator throw because `predicate` is missing.
