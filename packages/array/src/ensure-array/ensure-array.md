# `ensureArray`

Returns `value` as a new array. `null` and `undefined` become `[]`. A real array is copied, and holes become `undefined`. Every other value becomes a one-element array. A string stays one string. A typed array stays one typed array. The function does not throw and does not return `undefined`.

## Import

```ts
import { ensureArray } from "@sgx4u/array";
```

## Signature

```ts
function ensureArray<Item>(
    value: Item | readonly Item[] | null | undefined,
): Item[];
```

## Parameters

| Parameter | Type                                           | Description                                     |
| --------- | ---------------------------------------------- | ----------------------------------------------- |
| `value`   | `Item \| readonly Item[] \| null \| undefined` | An item, an array of items, or a missing value. |

## Examples

```ts
ensureArray(null); // []
ensureArray([1, 2]); // [1, 2], a new array
ensureArray("text"); // ["text"]
ensureArray(new Uint8Array([1, 2])); // [that Uint8Array]
```

## Edge cases

| Value                                     | Result                             |
| ----------------------------------------- | ---------------------------------- |
| `null`, `undefined`                       | a new `[]`                         |
| `[]`, `[1, 2]`                            | a new dense copy                   |
| a sparse array                            | holes become `undefined`           |
| `"text"`, `0`, `false`                    | a one-element array                |
| a typed array, a `Set`, a generator, `{}` | a one-element array of that value  |
| an empty input array                      | a new `[]`, not the same reference |

The input array is not mutated. The copy is shallow.
