# `groupBy`

Groups items by a key and keeps the first-seen group order. `asMap: true` returns a `Map` whose keys are the original `by` results. The default is a record whose keys are `String(key)`.

Distinct objects share the record key `"[object Object]"`. A `Map` keeps those objects separate. `NaN` groups with `NaN`, and `-0` groups with `0`. A symbol key uses `Symbol.prototype.toString` because `String(symbol)` throws.

JavaScript enumerates integer-like record keys in numeric order. Every other string key stays in first-seen order.

## Import

```ts
import { groupBy, type GroupByParams } from "@sgx4u/array";
```

## Signature

```ts
function groupBy<Item>(
    params: GroupByParams<Item> & { asMap: true },
): Map<unknown, Item[]> | undefined;

function groupBy<Item>(
    params: GroupByParams<Item>,
): Record<string, Item[]> | undefined;
```

## Parameters

| Name    | Type              | Default | Description                                  |
| ------- | ----------------- | ------- | -------------------------------------------- |
| `array` | `readonly Item[]` |         | Items to group.                              |
| `by`    | `Iteratee<Item>`  |         | Property key or function.                    |
| `asMap` | `boolean`         | `false` | `true` returns a `Map` of the original keys. |

## Examples

```ts
groupBy({ array: ["red", "blue", "red"], by: (item) => item });
// { red: ["red", "red"], blue: ["blue"] }
```

## Edge cases

- A non-object returns `undefined`. A non-array `array` returns `undefined` when `by` is valid.
- An invalid `by` throws `TypeError` before the array is checked.
- An empty array returns `{}` or an empty `Map`.
- Holes are read as `undefined`. The input is not mutated. Each bucket is a new array.
