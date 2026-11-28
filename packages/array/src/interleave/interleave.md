# `interleave`

Reads arrays in round-robin order and returns a new array. The inputs are not mutated.

The first pass takes index `0` from each array that has one, the next pass takes index `1`, and so on. An exhausted array is skipped.

## Import

```ts
import { interleave } from "@sgx4u/array";
```

## Signature

```ts
function interleave<Item>(params: InterleaveParams<Item>): Item[] | undefined;
```

## Parameters

| Name     | Type                           | Description                                  |
| -------- | ------------------------------ | -------------------------------------------- |
| `arrays` | `readonly (readonly Item[])[]` | Arrays to read. Every slot must be an array. |

## Examples

```ts
interleave({ arrays: [[1, 2, 3], [4], [5, 6]] }); // [1, 4, 5, 2, 6, 3]
interleave({ arrays: [[], [1, 2]] }); // [1, 2]
interleave({ arrays: [] }); // []
```

## Edge cases

- `null`, a string, or another non-object returns `undefined`.
- An empty list returns `[]`.
- A slot that is not an array, including `{}`, a typed array, a `Set`, or a generator, returns `undefined`.
- A hole is copied as `undefined`.
- The inputs are not mutated. The result is a new array.
