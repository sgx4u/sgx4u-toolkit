# `getFirst`

Returns the first item of an array. Pass a bare array, or `{ array, defaultValue }`. An empty array returns `defaultValue` when that property is present, including `0` and `false`. When the property is absent, an empty array returns `undefined`. A hole in the first position is an item, so it returns `undefined` instead of `defaultValue`. The array is not mutated.

## Import

```ts
import { getFirst, type GetFirstParams } from "@sgx4u/array";
```

## Signature

```ts
function getFirst<Item>(array: readonly Item[]): Item | undefined;
function getFirst<Item, DefaultValue>(
    params: GetFirstParams<Item, DefaultValue> & { defaultValue: DefaultValue },
): Item | DefaultValue;
```

## Parameters

| Parameter      | Type              | Description                                                               |
| -------------- | ----------------- | ------------------------------------------------------------------------- |
| `array`        | `readonly Item[]` | The array to read. A non-array returns `undefined`.                       |
| `defaultValue` | `DefaultValue`    | Returned when `array` is empty, including `0`. Omitted means `undefined`. |

## Examples

```ts
getFirst([1, 2, 3]); // 1
getFirst([]); // undefined
getFirst({ array: [], defaultValue: 0 }); // 0
getFirst({ array: [0], defaultValue: 1 }); // 0
```

## Edge cases

| Call                                               | Result                          |
| -------------------------------------------------- | ------------------------------- |
| `[]`, `{ array: [] }`                              | `undefined`                     |
| `{ array: [], defaultValue: 0 }`                   | `0`                             |
| `{ array: [], defaultValue: false }`               | `false`                         |
| `{ array: [], defaultValue: undefined }`           | `undefined`                     |
| a hole in the first position                       | `undefined`, not `defaultValue` |
| `[1]`                                              | `1`                             |
| `null`, `{}`, `"text"`                             | `undefined`                     |
| `new Uint8Array([1])`, `new Set([1])`, a generator | `undefined`                     |

The function does not throw.
