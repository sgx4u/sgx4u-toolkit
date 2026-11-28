# `splitWhen`

Splits an array at the first item that satisfies `predicate`. That item starts the right side. When no item matches, the right side is a new empty array and the left side is a dense copy. Both sides are new arrays. Holes become `undefined`. The input is not mutated. When the argument is a params object, `predicate` is checked before `array`.

## Import

```ts
import { splitWhen, type SplitWhenParams } from "@sgx4u/array";
```

## Signature

```ts
function splitWhen<Item>(
    params: SplitWhenParams<Item>,
): [Item[], Item[]] | undefined;
```

## Parameters

| Parameter   | Type              | Description                                                                       |
| ----------- | ----------------- | --------------------------------------------------------------------------------- |
| `array`     | `readonly Item[]` | The array to split. A non-array returns `undefined`.                              |
| `predicate` | `Predicate<Item>` | Called as `predicate(item, index, array)`. The first match starts the right side. |

## Examples

```ts
splitWhen({
    array: [1, 2, 3, 4],
    predicate: (item) => item > 2,
}); // [[1, 2], [3, 4]]

splitWhen({
    array: [1, 2, 3, 4],
    predicate: () => false,
}); // [[1, 2, 3, 4], []]
```

## Edge cases

| Call                               | Result                         |
| ---------------------------------- | ------------------------------ |
| the first item matches             | `[[], copy]`                   |
| no item matches                    | `[copy, []]`                   |
| an empty array                     | `[[], []]`                     |
| a hole that matches                | the hole starts the right side |
| `null`, `"text"`                   | `undefined`                    |
| `predicate` that is not a function | throws `TypeError`             |

`{}`, a typed array, a `Set`, and a generator throw because `predicate` is missing.
