# `findIndexes`

Returns every index whose item satisfies `predicate`, in order. An empty array, and an array with no match, return a new empty array. A hole is passed to `predicate` as `undefined`. The array is not mutated. When the argument is a params object, `predicate` is checked before `array`.

## Import

```ts
import { findIndexes, type FindIndexesParams } from "@sgx4u/array";
```

## Signature

```ts
function findIndexes<Item>(
    params: FindIndexesParams<Item>,
): number[] | undefined;
```

## Parameters

| Parameter   | Type              | Description                                                                      |
| ----------- | ----------------- | -------------------------------------------------------------------------------- |
| `array`     | `readonly Item[]` | The array to scan. A non-array returns `undefined` after `predicate` is checked. |
| `predicate` | `Predicate<Item>` | Called as `predicate(item, index, array)`. A non-function throws.                |

## Examples

```ts
findIndexes({
    array: [1, 2, 1],
    predicate: (item) => item === 1,
}); // [0, 2]

findIndexes({ array: [], predicate: () => true }); // []
```

## Edge cases

| Call                                           | Result                                    |
| ---------------------------------------------- | ----------------------------------------- |
| no matches                                     | a new `[]`                                |
| an empty array                                 | a new `[]`                                |
| a hole, when the predicate accepts `undefined` | that index                                |
| `null`, `"text"`                               | `undefined`                               |
| a non-array with a valid predicate             | `undefined`                               |
| `{}`, a typed array, a `Set`, a generator      | throws `TypeError`                        |
| `predicate` that is not a function             | throws, even when `array` is not an array |

```text
`predicate` must be a function; received "no".
```
