# `rejectItems`

Returns the items for which `predicate` is false. An item is kept when `predicate` returns a falsy result. An empty array, and an array whose every item matches, return a new empty array. The result is a new dense array. The input is not mutated. When the argument is a params object, `predicate` is checked before `array`.

## Import

```ts
import { rejectItems, type RejectItemsParams } from "@sgx4u/array";
```

## Signature

```ts
function rejectItems<Item>(params: RejectItemsParams<Item>): Item[] | undefined;
```

## Parameters

| Parameter   | Type              | Description                                                                |
| ----------- | ----------------- | -------------------------------------------------------------------------- |
| `array`     | `readonly Item[]` | The array to copy from. A non-array returns `undefined`.                   |
| `predicate` | `Predicate<Item>` | Called as `predicate(item, index, array)`. A truthy result drops the item. |

## Examples

```ts
rejectItems({
    array: [1, 2, 3, 4],
    predicate: (item) => item % 2 === 0,
}); // [1, 3]
```

## Edge cases

| Call                                           | Result              |
| ---------------------------------------------- | ------------------- |
| every item matches                             | a new `[]`          |
| no item matches                                | a new copy          |
| an empty array                                 | a new `[]`          |
| a hole, when the predicate matches `undefined` | the hole is dropped |
| `null`, `"text"`                               | `undefined`         |
| `predicate` that is not a function             | throws `TypeError`  |

`{}`, a typed array, a `Set`, and a generator throw because `predicate` is missing.

```text
`predicate` must be a function; received "no".
```
