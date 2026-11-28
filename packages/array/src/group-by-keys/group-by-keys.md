# `groupByKeys`

Groups items once for each key, nesting one plain object per key. The deepest value is an `Item[]`. An empty `keys` list returns a shallow copy of the array. The return type is `unknown` because the depth follows `keys`.

Record keys are `String(key)`, so distinct objects share `"[object Object]"`. A symbol uses `Symbol.prototype.toString`. The first key sees the original array. Later keys see the group produced by the previous key, and the index restarts inside that group.

## Import

```ts
import { groupByKeys, type GroupByKeysParams } from "@sgx4u/array";
```

## Signature

```ts
function groupByKeys<Item>(params: GroupByKeysParams<Item>): unknown;
```

## Parameters

| Name    | Type                        | Description                                              |
| ------- | --------------------------- | -------------------------------------------------------- |
| `array` | `readonly Item[]`           | Items to group.                                          |
| `keys`  | `readonly Iteratee<Item>[]` | One iteratee per nesting level, from the outside inward. |

## Examples

```ts
groupByKeys({
    array: [
        { city: "Paris", kind: "a" },
        { city: "Lima", kind: "a" },
    ],
    keys: ["city", "kind"],
});
// { Paris: { a: [{ city: "Paris", kind: "a" }] }, Lima: { a: [...] } }
```

## Edge cases

- A non-object returns `undefined`. A non-array `array` returns `undefined` when every key is an iteratee.
- `keys` must be an array. Any other value throws `TypeError`, including when `array` is also invalid.
- An entry that is not a property key or a function throws `TypeError`.
- `keys: []` returns a new array. Holes in that copy are `undefined`.
- The input is not mutated.
