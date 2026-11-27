# `isTypedArray`

Reports whether a value is a typed array. `DataView` is an `ArrayBuffer` view and is not a typed array. Ordinary arrays are not typed arrays. The value is not mutated, and the function does not throw.

## Import

```ts
import { isTypedArray } from "@sgx4u/array";
```

## Signature

```ts
function isTypedArray(value: unknown): boolean;
```

## Parameters

| Parameter | Type      | Description                                                              |
| --------- | --------- | ------------------------------------------------------------------------ |
| `value`   | `unknown` | Any value. `Uint8Array`, `Int32Array`, and the other typed arrays match. |

## Examples

```ts
isTypedArray(new Uint8Array([1])); // true
isTypedArray(new Int32Array([1])); // true
isTypedArray(new DataView(new ArrayBuffer(8))); // false
isTypedArray([1]); // false
```

## Edge cases

| Value                                      | Result  |
| ------------------------------------------ | ------- |
| `Uint8Array`, `Int32Array`, `Float64Array` | `true`  |
| `new DataView(new ArrayBuffer(8))`         | `false` |
| `[]`, `[1]`                                | `false` |
| `null`, `{}`, `"text"`                     | `false` |
| `new Set([1])`, a generator                | `false` |

The function does not throw. A typed array cannot be frozen with `Object.freeze` when it has elements; the check only reads the value.
