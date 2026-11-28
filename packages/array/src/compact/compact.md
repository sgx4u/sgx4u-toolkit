# `compact`

Returns a new array without `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN`. `-0` is removed because `-0 === 0`. A hole is `undefined` and is removed. `true`, non-zero numbers, non-empty strings, bigints other than `0n`, and objects are kept. The input is not mutated. A non-array returns `undefined`.

`NaN` is removed at runtime. It is not part of `Falsy`, because a `number` type includes `NaN`.

## Import

```ts
import { compact, type Falsy } from "@sgx4u/array";
```

## Signature

```ts
function compact<Item>(
    array: readonly Item[],
): Array<Exclude<Item, Falsy>> | undefined;
```

`Falsy` is `false | 0 | 0n | "" | null | undefined`.

## Parameters

| Parameter | Type              | Description                                              |
| --------- | ----------------- | -------------------------------------------------------- |
| `array`   | `readonly Item[]` | The array to copy from. A non-array returns `undefined`. |

## Examples

```ts
compact([0, 1, false, "", "a", null, Number.NaN, 0n]); // [1, "a"]
compact([true, " ", 1n, {}]); // [true, " ", 1n, {}]
```

## Edge cases

| Value                                              | Result      |
| -------------------------------------------------- | ----------- |
| `[]`                                               | a new `[]`  |
| `[0]`, `[-0]`, `[0n]`, `[""]`, `[false]`, `[null]` | a new `[]`  |
| `[Number.NaN]`                                     | a new `[]`  |
| a hole                                             | removed     |
| `" "`, `1`, `-1`, `1n`, `{}`, `[]`                 | kept        |
| `null`, `{}`, `"text"`                             | `undefined` |
| `new Uint8Array([1])`, `new Set([1])`, a generator | `undefined` |

The result is a new array. The input is not mutated.
