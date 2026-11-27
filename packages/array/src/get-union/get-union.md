# `getUnion`

Keeps the first-seen item from every array. One membership is shared, so a later array cannot add a value an earlier array already had. `by`, when set, wins over `equals`: the key is compared with SameValueZero, and the stored value is the original item. An empty list returns `[]`.

## Import

```ts
import { getUnion, type GetUnionParams } from "@sgx4u/array";
```

## Signature

```ts
function getUnion<Item>(params: GetUnionParams<Item>): Item[] | undefined;
```

## Parameters

| Name     | Type                           | Default       | Description                                              |
| -------- | ------------------------------ | ------------- | -------------------------------------------------------- |
| `arrays` | `readonly (readonly Item[])[]` |               | Arrays to combine, from left to right.                   |
| `by`     | `Iteratee<Item>`               |               | When set, uniqueness uses this key. `equals` is ignored. |
| `equals` | `Equals<Item>`                 | SameValueZero | Used only when `by` is omitted.                          |

## Examples

```ts
getUnion({
    arrays: [
        [1, 2],
        [2, 3],
    ],
});
// [1, 2, 3]
```

## Edge cases

- `null`, `{}`, a string, a `Uint8Array`, a `Set`, and a generator return `undefined`.
- A list that is not an array, or a slot that is not an array, returns `undefined`.
- An invalid `by` throws `TypeError`. When `by` is omitted, a non-function `equals` throws `TypeError`.
- `NaN` matches `NaN`, and `-0` matches `0`, unless a custom `equals` says otherwise.
- One array returns its unique items. The inputs are not mutated.
