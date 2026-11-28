# `getLength`

Returns the length of a real array, a typed array, a string, or another array-like value. A valid length is an integer from `0` through `2^53 - 1`. Functions are excluded. Plain objects, `null`, and other values return `undefined`. The value is not mutated, and the function does not throw.

## Import

```ts
import { getLength } from "@sgx4u/array";
```

## Signature

```ts
function getLength(value: unknown): number | undefined;
```

## Parameters

| Parameter | Type      | Description                                                 |
| --------- | --------- | ----------------------------------------------------------- |
| `value`   | `unknown` | An array, a typed array, a string, or an array-like object. |

## Examples

```ts
getLength([1, 2]); // 2
getLength("text"); // 4
getLength(new Uint8Array([1])); // 1
getLength({ length: 2 }); // 2
getLength({}); // undefined
```

## Edge cases

| Value                               | Result      |
| ----------------------------------- | ----------- |
| `[]`, `""`                          | `0`         |
| `[1]`, `"text"`                     | `1`, `4`    |
| `new Uint8Array([1])`               | `1`         |
| `{ length: 2 }`                     | `2`         |
| `{ length: 1.5 }`, `{ length: -1 }` | `undefined` |
| `null`, `{}`, a function            | `undefined` |
| `new Set([1])`, a generator         | `undefined` |

The function does not throw.
