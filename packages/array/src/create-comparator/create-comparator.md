# `createComparator`

Builds a comparator from the same keys `sortBy` accepts. The result is `(left, right) => -1 | 0 | 1`. It does not take an array and does not return `undefined`. Invalid keys throw.

A key function is called with the item, index `0`, and a one-element array containing that item. A pairwise comparator has no source array, so the index is not an index into a larger list.

`null`, `undefined`, and `NaN` use `nulls`, which defaults to `"last"`. That placement does not flip with direction.

## Import

```ts
import { createComparator, type CreateComparatorParams } from "@sgx4u/array";
```

## Signature

```ts
function createComparator<Item>(
    params: CreateComparatorParams<Item>,
): (left: Item, right: Item) => -1 | 0 | 1;
```

## Parameters

| Name          | Type                                        | Default            | Description                                             |
| ------------- | ------------------------------------------- | ------------------ | ------------------------------------------------------- |
| `keys`        | `readonly SortKey<Item>[]`                  |                    | Keys from left to right. An empty list ties every pair. |
| `direction`   | `"ascending" \| "descending"`               | `"ascending"`      | Default direction. A key can override it.               |
| `locale`      | `string \| readonly string[]`               | the runtime locale | BCP 47 tag or list.                                     |
| `numeric`     | `boolean`                                   | `false`            | When `true`, `"item2"` comes before `"item10"`.         |
| `sensitivity` | `"base" \| "accent" \| "case" \| "variant"` | `"variant"`        | Collator sensitivity.                                   |
| `nulls`       | `"first" \| "last"`                         | `"last"`           | Where nullish keys and `NaN` go.                        |

## Examples

```ts
createComparator({ keys: ["name"], locale: "en-US" });
```

## Edge cases

- `null`, a non-object, and a missing `keys` throw `TypeError`.
- `keys` must be an array of property keys, functions, or key objects.
- An unknown `direction`, `sensitivity`, or `nulls` throws `RangeError`. An invalid locale throws `RangeError`.
- `0` means the keys tied. This comparator does not look at an original index, so a stable sort has to come from the caller, such as `Array#toSorted`.
