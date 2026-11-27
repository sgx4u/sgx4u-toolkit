# `chunkBy`

Splits an array where the `by` result changes. Consecutive items whose keys match under SameValueZero stay in one group. A later repeat of an earlier key starts a new group.

## Import

```ts
import { chunkBy, type ChunkByParams } from "@sgx4u/array";
```

## Signature

```ts
function chunkBy<Item>(params: ChunkByParams<Item>): Item[][] | undefined;
```

## Parameters

| Name    | Type              | Description                                                          |
| ------- | ----------------- | -------------------------------------------------------------------- |
| `array` | `readonly Item[]` | Items to split.                                                      |
| `by`    | `Iteratee<Item>`  | Property key or function. `NaN` matches `NaN`, and `-0` matches `0`. |

`by` receives the item, its index, and the source array. A property key reads that property. `null` and `undefined` items produce `undefined` instead of throwing.

## Examples

```ts
chunkBy({ array: [1, 1, 2, 2, 1], by: (item) => item });
// [[1, 1], [2, 2], [1]]
```

## Edge cases

- `null`, a string, and any other non-object return `undefined`.
- A non-array `array` returns `undefined` when `by` is a valid iteratee.
- A missing or invalid `by` throws `TypeError`, even when `array` is also invalid.
- Holes are passed to `by` as `undefined`. The input is not mutated.
