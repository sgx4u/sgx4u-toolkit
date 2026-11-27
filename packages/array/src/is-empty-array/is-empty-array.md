# `isEmptyArray`

Reports whether a value is a real array with length `0`. A typed array, a string, and an array-like object return `false`, even when their length is `0`. The value is not mutated, and the function does not throw.

## Import

```ts
import { isEmptyArray } from "@sgx4u/array";
```

## Signature

```ts
function isEmptyArray(value: unknown): boolean;
```

## Parameters

| Parameter | Type      | Description                                          |
| --------- | --------- | ---------------------------------------------------- |
| `value`   | `unknown` | Any value. Only a real array of length `0` is empty. |

## Examples

```ts
isEmptyArray([]); // true
isEmptyArray([1]); // false
isEmptyArray(new Uint8Array()); // false
isEmptyArray(""); // false
```

## Edge cases

| Value                                  | Result                        |
| -------------------------------------- | ----------------------------- |
| `[]`                                   | `true`                        |
| `[1]`, `[1, 2]`                        | `false`                       |
| an array whose only position is a hole | `false`. Length is still `1`. |
| `null`, `{}`, `"text"`, `""`           | `false`                       |
| `new Uint8Array()`, `new Set([1])`     | `false`                       |
| a generator                            | `false`                       |
| an empty array subclass                | `true`                        |

The function does not throw.
