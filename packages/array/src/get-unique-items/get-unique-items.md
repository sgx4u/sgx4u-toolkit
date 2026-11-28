# `getUniqueItems`

Drops duplicate items. Pass a bare array, or `{ array, equals, keep }`. Order is the order of the kept occurrences. `keep` defaults to `"first"`. `"last"` keeps the later item, so `[1, 2, 1]` becomes `[2, 1]`.

The default equality is SameValueZero. `NaN` matches `NaN`, and `-0` matches `0`.

## Import

```ts
import {
    getUniqueItems,
    type GetUniqueItemsParams,
    type UniqueKeep,
} from "@sgx4u/array";
```

## Signature

```ts
function getUniqueItems<Item>(array: readonly Item[]): Item[];

function getUniqueItems<Item>(
    params: GetUniqueItemsParams<Item>,
): Item[] | undefined;
```

## Parameters

| Name     | Type                | Default       | Description                                                   |
| -------- | ------------------- | ------------- | ------------------------------------------------------------- |
| `array`  | `readonly Item[]`   |               | Items to scan from left to right. A bare array is this value. |
| `equals` | `Equals<Item>`      | SameValueZero | Used only by the params form.                                 |
| `keep`   | `"first" \| "last"` | `"first"`     | Which occurrence to keep.                                     |

## Examples

```ts
getUniqueItems([1, 2, 1, 3]);
// [1, 2, 3]
```

## Edge cases

- A bare array always returns a new array, including `[]` for an empty array.
- `null`, `{}`, a string, a `Uint8Array`, a `Set`, and a generator return `undefined`.
- An unknown `keep` throws `RangeError`. A non-function `equals` throws `TypeError`. Both are checked before a bad `array` returns `undefined`.
- Holes are read as `undefined`. The input is not mutated.
