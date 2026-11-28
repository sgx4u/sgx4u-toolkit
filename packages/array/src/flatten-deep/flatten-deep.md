# `flattenDeep`

Opens nested arrays until none remain and returns a new array. The input is not mutated.

Only arrays are opened. A `Set`, a string, a typed array, or another iterable stays as one item. Pass the array itself, not a params object.

## Import

```ts
import { flattenDeep } from "@sgx4u/array";
```

## Signature

```ts
function flattenDeep(array: readonly unknown[]): unknown[];
```

A non-array argument returns `undefined`.

## Parameters

| Name    | Type                 | Description                                        |
| ------- | -------------------- | -------------------------------------------------- |
| `array` | `readonly unknown[]` | Source array. Nested arrays are opened completely. |

## Examples

```ts
flattenDeep([1, [2, [3, [4]]], 5]); // [1, 2, 3, 4, 5]
flattenDeep([new Set([1]), [2]]); // [Set { 1 }, 2]
flattenDeep([]); // []
```

## Edge cases

- `null`, `{}`, a string, a typed array, a `Set`, or a generator returns `undefined`.
- An empty array returns a new `[]`.
- A hole becomes `undefined`.
- The input is not mutated. Nested arrays are not mutated.
