# `flatten`

Opens nested arrays and returns a new array. The input is not mutated.

Pass a bare array to open one level, or `{ array, depth }`. Only arrays are opened. A string, a `Set`, a typed array, or another iterable stays as one item.

## Import

```ts
import { flatten } from "@sgx4u/array";
```

## Signature

```ts
function flatten(array: readonly unknown[]): unknown[];
function flatten(params: FlattenParams): unknown[] | undefined;
```

## Parameters

| Name    | Type                 | Default | Description                                              |
| ------- | -------------------- | ------- | -------------------------------------------------------- |
| `array` | `readonly unknown[]` |         | Source array. A bare array uses depth `1`.               |
| `depth` | `number`             | `1`     | How many levels of arrays to open. `0` copies the array. |

## Examples

```ts
flatten([1, [2, [3]], 4]); // [1, 2, [3], 4]
flatten({ array: [1, [2, [3]]], depth: 2 }); // [1, 2, 3]
flatten({ array: [1, [2]], depth: 0 }); // [1, [2]]
```

## Edge cases

- `null`, a string, or another non-object returns `undefined`.
- A params object whose `array` is `{}`, a typed array, a `Set`, or a generator returns `undefined`.
- `depth` of `0` returns a shallow copy. Nested arrays keep their references.
- A present `depth` that is not a finite integer greater than or equal to `0` throws. A non-number is `TypeError`. A negative or fractional number is `RangeError`. The check runs even when `array` is invalid.
- An empty array returns a new `[]`.
- A hole becomes `undefined`.
- Chunks from `chunk` flatten back to the original items at depth `1`.
- The input is not mutated.
