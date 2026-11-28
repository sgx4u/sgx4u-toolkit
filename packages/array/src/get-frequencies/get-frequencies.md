# `getFrequencies`

Returns how often each distinct value appears, in first-seen order. Each entry is `{ value, item, count }`. `value` is the item, or the `by` result when `by` is set. `item` is the first occurrence. Keys use SameValueZero. Numbers are not required.

## Import

```ts
import { getFrequencies } from "@sgx4u/array";
```

## Signature

```ts
function getFrequencies<Item>(
    params: GetFrequenciesParams<Item>,
): FrequencyEntry<Item>[] | undefined;
```

## Parameters

| Name    | Description                                                               |
| ------- | ------------------------------------------------------------------------- |
| `array` | Items to count.                                                           |
| `by`    | Optional property key or function. Omit it to count the items themselves. |

## Examples

```ts
getFrequencies({ array: ["a", "b", "a"] });
// [
//   { value: "a", item: "a", count: 2 },
//   { value: "b", item: "b", count: 1 },
// ]

getFrequencies({ array: [] }); // undefined
```

## Edge cases

| Input                            | Result                 |
| -------------------------------- | ---------------------- |
| `[]`, or `array` is not an array | `undefined`, not `[]`  |
| A sparse hole                    | Counted as `undefined` |
| `NaN`                            | `NaN` matches `NaN`    |
| `by` is not an iteratee          | Throws `TypeError`     |

The result is a new array. The input is not mutated.
