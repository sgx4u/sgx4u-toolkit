# `getTail`

Returns every item except the first, in a new dense array. An empty array and a one-item array return a new empty array. A non-array returns `undefined`. Holes become `undefined`. The input is not mutated.

## Import

```ts
import { getTail } from "@sgx4u/array";
```

## Signature

```ts
function getTail<Item>(array: readonly Item[]): Item[] | undefined;
```

## Parameters

| Parameter | Type              | Description                                              |
| --------- | ----------------- | -------------------------------------------------------- |
| `array`   | `readonly Item[]` | The array to copy from. A non-array returns `undefined`. |

## Examples

```ts
getTail([1, 2, 3]); // [2, 3]
getTail([1]); // []
getTail([]); // []
getTail(null); // undefined
```

## Edge cases

| Value                                              | Result                   |
| -------------------------------------------------- | ------------------------ |
| `[]`, `[1]`                                        | a new `[]`               |
| `[1, 2, 3]`                                        | `[2, 3]`, a new array    |
| a sparse array                                     | holes become `undefined` |
| `null`, `{}`, `"text"`                             | `undefined`              |
| `new Uint8Array([1])`, `new Set([1])`, a generator | `undefined`              |

The result is never the input array.
