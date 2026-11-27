# `chunk`

Splits an array into consecutive groups of `size` items. The last group is shorter when the length is not a multiple of `size`.

## Import

```ts
import { chunk, type ChunkParams } from "@sgx4u/array";
```

## Signature

```ts
function chunk<Item>(params: ChunkParams<Item>): Item[][] | undefined;
```

## Parameters

| Name    | Type              | Description                                                     |
| ------- | ----------------- | --------------------------------------------------------------- |
| `array` | `readonly Item[]` | Items to split.                                                 |
| `size`  | `number`          | Maximum length of one group. Must be a positive finite integer. |

## Examples

```ts
chunk({ array: [1, 2, 3, 4, 5], size: 2 });
// [[1, 2], [3, 4], [5]]
```

## Edge cases

- `null`, a string, a function, and any other non-object return `undefined`.
- A non-array `array`, including `{}`, a `Uint8Array`, a `Set`, or a generator, returns `undefined` when `size` is valid.
- `size` is checked before `array`. `0`, a fraction, `NaN`, and `Infinity` throw `RangeError`. A non-number throws `TypeError`.
- A missing `size`, including `chunk({})`, throws `TypeError`.
- Holes are copied as `undefined`. The input is not mutated. Every group is a new array.
