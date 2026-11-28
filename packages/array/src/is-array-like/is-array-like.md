# `isArrayLike`

Reports whether a value has an array-like length. An integer length from `0` through `2^53 - 1` qualifies. Strings are included. Functions and `null` are not. The value is not mutated, and the function does not throw.

## Import

```ts
import { isArrayLike } from "@sgx4u/array";
```

## Signature

```ts
function isArrayLike(value: unknown): boolean;
```

## Parameters

| Parameter | Type      | Description                                                                                 |
| --------- | --------- | ------------------------------------------------------------------------------------------- |
| `value`   | `unknown` | Any value. Arrays, typed arrays, strings, and objects with a valid `length` are array-like. |

## Examples

```ts
isArrayLike([1, 2]); // true
isArrayLike("text"); // true
isArrayLike(new Uint8Array([1])); // true
isArrayLike({ length: 2 }); // true

isArrayLike(null); // false
isArrayLike({}); // false
isArrayLike(() => undefined); // false
```

## Edge cases

| Value                                     | Result  |
| ----------------------------------------- | ------- |
| `[]`, `[1]`                               | `true`  |
| `""`, `"text"`                            | `true`  |
| `new Uint8Array([1])`                     | `true`  |
| `{ length: 0 }`, `{ length: 2 }`          | `true`  |
| `{ length: Number.MAX_SAFE_INTEGER }`     | `true`  |
| `{ length: -1 }`, `{ length: 1.5 }`       | `false` |
| `{ length: Number.MAX_SAFE_INTEGER + 1 }` | `false` |
| `null`, `undefined`, `{}`                 | `false` |
| a function, `new Set([1])`, a generator   | `false` |
| `new DataView(new ArrayBuffer(8))`        | `false` |

The function does not throw.
