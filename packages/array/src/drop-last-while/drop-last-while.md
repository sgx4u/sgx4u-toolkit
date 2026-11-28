# `dropLastWhile`

Drops the trailing run of items that satisfy `predicate`. The scan walks from the end, then copies the prefix that remains, in its original order. `[1, 2, 3, 4]` while `item > 2` returns `[1, 2]`. An empty array, and an array whose every item matches, return a new empty array. The input is not mutated. When the argument is a params object, `predicate` is checked before `array`.

## Import

```ts
import { dropLastWhile, type DropLastWhileParams } from "@sgx4u/array";
```

## Signature

```ts
function dropLastWhile<Item>(
    params: DropLastWhileParams<Item>,
): Item[] | undefined;
```

## Parameters

| Parameter   | Type              | Description                                                       |
| ----------- | ----------------- | ----------------------------------------------------------------- |
| `array`     | `readonly Item[]` | The array to copy from. A non-array returns `undefined`.          |
| `predicate` | `Predicate<Item>` | Called as `predicate(item, index, array)`. A non-function throws. |

## Examples

```ts
dropLastWhile({
    array: [1, 2, 3, 4],
    predicate: (item) => item > 2,
}); // [1, 2]

dropLastWhile({
    array: [4, 1, 3],
    predicate: (item) => item > 2,
}); // [4, 1]
```

## Edge cases

| Call                               | Result             |
| ---------------------------------- | ------------------ |
| every item matches                 | a new `[]`         |
| the last item fails                | a new copy         |
| an empty array                     | a new `[]`         |
| `null`, `"text"`                   | `undefined`        |
| `predicate` that is not a function | throws `TypeError` |

`{}`, a typed array, a `Set`, and a generator throw because `predicate` is missing.
