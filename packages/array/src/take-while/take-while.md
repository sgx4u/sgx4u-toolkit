# `takeWhile`

Returns the leading run of items that satisfy `predicate`. The copy stops before the first item that does not. An empty array, and an array whose first item fails, return a new empty array. The result is a new dense array. The input is not mutated. When the argument is a params object, `predicate` is checked before `array`.

## Import

```ts
import { takeWhile, type TakeWhileParams } from "@sgx4u/array";
```

## Signature

```ts
function takeWhile<Item>(params: TakeWhileParams<Item>): Item[] | undefined;
```

## Parameters

| Parameter   | Type              | Description                                                                              |
| ----------- | ----------------- | ---------------------------------------------------------------------------------------- |
| `array`     | `readonly Item[]` | The array to copy from. A non-array returns `undefined`.                                 |
| `predicate` | `Predicate<Item>` | Called as `predicate(item, index, array)`. A hole is `undefined`. A non-function throws. |

## Examples

```ts
takeWhile({
    array: [1, 2, 0, 3],
    predicate: (item) => item > 0,
}); // [1, 2]
```

## Edge cases

| Call                               | Result                        |
| ---------------------------------- | ----------------------------- |
| the first item fails               | a new `[]`                    |
| every item matches                 | a new copy                    |
| an empty array                     | a new `[]`                    |
| a hole that fails the predicate    | the run stops before the hole |
| `null`, `"text"`                   | `undefined`                   |
| a non-array with a valid predicate | `undefined`                   |
| `predicate` that is not a function | throws `TypeError`            |

`{}`, a typed array, a `Set`, and a generator throw because `predicate` is missing. A bad predicate throws even when `array` is not an array.
