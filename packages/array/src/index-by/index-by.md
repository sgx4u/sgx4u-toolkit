# `indexBy`

Keeps one item for each string key. The key is `String(by(item))`, so distinct objects share `"[object Object]"`. `onConflict` defaults to `"last"`. `"first"` keeps the earliest item. `"throw"` throws `RangeError` when a key is repeated.

## Import

```ts
import {
    indexBy,
    type IndexByParams,
    type IndexByConflict,
} from "@sgx4u/array";
```

## Signature

```ts
function indexBy<Item>(
    params: IndexByParams<Item>,
): Record<string, Item> | undefined;
```

## Parameters

| Name         | Type                           | Default  | Description               |
| ------------ | ------------------------------ | -------- | ------------------------- |
| `array`      | `readonly Item[]`              |          | Items to index.           |
| `by`         | `Iteratee<Item>`               |          | Property key or function. |
| `onConflict` | `"first" \| "last" \| "throw"` | `"last"` | Which duplicate to keep.  |

## Examples

```ts
indexBy({
    array: [
        { id: "a", name: "one" },
        { id: "a", name: "two" },
    ],
    by: "id",
});
// { a: { id: "a", name: "two" } }
```

## Edge cases

- A non-object returns `undefined`. A non-array `array` returns `undefined` when `by` and `onConflict` are valid.
- An invalid `by` throws `TypeError`. An unknown `onConflict` throws `RangeError`. Both are checked before `array`.
- `"throw"` uses this message: `` `by` produced a duplicate key "a" while `onConflict` is "throw". ``
- The string in that message is quoted by `describeReceived`.
- Holes are read as `undefined`. The input is not mutated. Key order is first-seen, aside from integer-like keys.
