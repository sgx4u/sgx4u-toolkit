# `getInitial`

Returns every item except the last, in a new dense array. An empty array and a one-item array return a new empty array. A non-array returns `undefined`. Holes become `undefined`. The input is not mutated.

## Import

```ts
import { getInitial } from "@sgx4u/array";
```

## Signature

```ts
function getInitial<Item>(array: readonly Item[]): Item[] | undefined;
```

## Parameters

| Parameter | Type              | Description                                              |
| --------- | ----------------- | -------------------------------------------------------- |
| `array`   | `readonly Item[]` | The array to copy from. A non-array returns `undefined`. |

## Examples

```ts
getInitial([1, 2, 3]); // [1, 2]
getInitial([1]); // []
getInitial([]); // []
getInitial("text"); // undefined
```

## Edge cases

| Value                                              | Result                   |
| -------------------------------------------------- | ------------------------ |
| `[]`, `[1]`                                        | a new `[]`               |
| `[1, 2, 3]`                                        | `[1, 2]`, a new array    |
| a sparse array                                     | holes become `undefined` |
| `null`, `{}`, `"text"`                             | `undefined`              |
| `new Uint8Array([1])`, `new Set([1])`, a generator | `undefined`              |

The result is never the input array. Object items are copied by reference.
