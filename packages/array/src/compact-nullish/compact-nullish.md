# `compactNullish`

Returns a new array without `null` and `undefined`. `0`, `false`, `""`, and `NaN` are kept. A hole is `undefined` and is removed. The input is not mutated. A non-array returns `undefined`.

## Import

```ts
import { compactNullish } from "@sgx4u/array";
```

## Signature

```ts
function compactNullish<Item>(
    array: readonly Item[],
): Array<NonNullable<Item>> | undefined;
```

## Parameters

| Parameter | Type              | Description                                              |
| --------- | ----------------- | -------------------------------------------------------- |
| `array`   | `readonly Item[]` | The array to copy from. A non-array returns `undefined`. |

## Examples

```ts
compactNullish([0, false, "", null, undefined, 1]); // [0, false, "", 1]
compactNullish([Number.NaN]); // [NaN]
```

## Edge cases

| Value                                              | Result      |
| -------------------------------------------------- | ----------- |
| `[]`                                               | a new `[]`  |
| `[null]`, `[undefined]`                            | a new `[]`  |
| a hole                                             | removed     |
| `0`, `false`, `""`, `NaN`                          | kept        |
| `null`, `{}`, `"text"`                             | `undefined` |
| `new Uint8Array([1])`, `new Set([1])`, a generator | `undefined` |

The result is a new array. The input is not mutated.
