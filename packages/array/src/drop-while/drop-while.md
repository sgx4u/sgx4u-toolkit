# `dropWhile`

Drops the leading run of items that satisfy `predicate`. The first item that does not satisfy it starts the result. An empty array, and an array whose every item matches, return a new empty array. The result is a new dense array. The input is not mutated. When the argument is a params object, `predicate` is checked before `array`.

## Import

```ts
import { dropWhile, type DropWhileParams } from "@sgx4u/array";
```

## Signature

```ts
function dropWhile<Item>(params: DropWhileParams<Item>): Item[] | undefined;
```

## Parameters

| Parameter   | Type              | Description                                                                              |
| ----------- | ----------------- | ---------------------------------------------------------------------------------------- |
| `array`     | `readonly Item[]` | The array to copy from. A non-array returns `undefined`.                                 |
| `predicate` | `Predicate<Item>` | Called as `predicate(item, index, array)`. A hole is `undefined`. A non-function throws. |

## Examples

```ts
dropWhile({
    array: [1, 2, 0, 3],
    predicate: (item) => item > 0,
}); // [0, 3]
```

## Edge cases

| Call                               | Result             |
| ---------------------------------- | ------------------ |
| every item matches                 | a new `[]`         |
| the first item fails               | a new copy         |
| an empty array                     | a new `[]`         |
| a hole that fails the predicate    | the hole is kept   |
| `null`, `"text"`                   | `undefined`        |
| `predicate` that is not a function | throws `TypeError` |

`{}`, a typed array, a `Set`, and a generator throw because `predicate` is missing.
