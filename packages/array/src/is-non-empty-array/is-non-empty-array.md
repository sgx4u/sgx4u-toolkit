# `isNonEmptyArray`

Reports whether a value is a real array with at least one item. A `true` result narrows the value to `NonEmptyArray<unknown>`. A hole still counts: length `1` is non-empty even when that position reads as `undefined`. The value is not mutated, and the function does not throw.

## Import

```ts
import { isNonEmptyArray } from "@sgx4u/array";
```

## Signature

```ts
function isNonEmptyArray(value: unknown): value is NonEmptyArray<unknown>;
```

`NonEmptyArray<Item>` is `[Item, ...Item[]]`.

## Parameters

| Parameter | Type      | Description                                                 |
| --------- | --------- | ----------------------------------------------------------- |
| `value`   | `unknown` | Any value. Only a real array of length `1` or more matches. |

## Examples

```ts
isNonEmptyArray([1]); // true
isNonEmptyArray([]); // false

const value: unknown = ["first"];
if (isNonEmptyArray(value)) {
    value[0]; // "first"
}
```

## Edge cases

| Value                                 | Result  |
| ------------------------------------- | ------- |
| `[1]`, `[1, 2]`                       | `true`  |
| `[]`                                  | `false` |
| an array of length `1` that is a hole | `true`  |
| `null`, `{}`, `"text"`                | `false` |
| `new Uint8Array([1])`, `new Set([1])` | `false` |
| a generator                           | `false` |

The function does not throw.
