# `toArray`

Copies an array, a typed array, a string, another iterable, or an array-like object into a new dense array. Strings become characters. A `Set` and a generator are copied. Holes become `undefined`. `null`, `undefined`, functions, and plain objects that are not array-like return `undefined`. The input is not mutated.

## Import

```ts
import { toArray } from "@sgx4u/array";
```

## Signature

```ts
function toArray(value: unknown): unknown[] | undefined;
```

## Parameters

| Parameter | Type      | Description                                                        |
| --------- | --------- | ------------------------------------------------------------------ |
| `value`   | `unknown` | A real array, typed array, string, iterable, or array-like object. |

## Examples

```ts
toArray([1, 2]); // [1, 2]
toArray("text"); // ["t", "e", "x", "t"]
toArray(new Uint8Array([1])); // [1]
toArray(new Set([1])); // [1]
toArray({ length: 2, 0: "a", 1: "b" }); // ["a", "b"]
toArray(null); // undefined
```

## Edge cases

| Value                           | Result                   |
| ------------------------------- | ------------------------ |
| `[]`                            | a new `[]`               |
| a sparse array                  | holes become `undefined` |
| `""`                            | `[]`                     |
| `"text"`                        | one string per character |
| `new Uint8Array([1])`           | `[1]`                    |
| `new Set([1])`, a generator     | the yielded values       |
| `{ length: 3, 0: "a", 2: "c" }` | `["a", undefined, "c"]`  |
| `null`, `undefined`, `{}`       | `undefined`              |
| a function, a `DataView`        | `undefined`              |

The result is never the input array.
