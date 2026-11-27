# `getLast`

Returns the last item of an array. Pass a bare array, or `{ array, defaultValue }`. An empty array returns `defaultValue` when that property is present, including `0` and `false`. When the property is absent, an empty array returns `undefined`. A hole in the last position is an item, so it returns `undefined` instead of `defaultValue`. The array is not mutated.

## Import

```ts
import { getLast, type GetLastParams } from "@sgx4u/array";
```

## Signature

```ts
function getLast<Item>(array: readonly Item[]): Item | undefined;
function getLast<Item, DefaultValue>(
    params: GetLastParams<Item, DefaultValue> & { defaultValue: DefaultValue },
): Item | DefaultValue;
```

## Parameters

| Parameter      | Type              | Description                                                               |
| -------------- | ----------------- | ------------------------------------------------------------------------- |
| `array`        | `readonly Item[]` | The array to read. A non-array returns `undefined`.                       |
| `defaultValue` | `DefaultValue`    | Returned when `array` is empty, including `0`. Omitted means `undefined`. |

## Examples

```ts
getLast([1, 2, 3]); // 3
getLast([]); // undefined
getLast({ array: [], defaultValue: 0 }); // 0
getLast({ array: [1, 0], defaultValue: 5 }); // 0
```

## Edge cases

| Call                                               | Result                          |
| -------------------------------------------------- | ------------------------------- |
| `[]`, `{ array: [] }`                              | `undefined`                     |
| `{ array: [], defaultValue: 0 }`                   | `0`                             |
| `{ array: [], defaultValue: false }`               | `false`                         |
| a hole in the last position                        | `undefined`, not `defaultValue` |
| `[1]`                                              | `1`                             |
| `null`, `{}`, `"text"`                             | `undefined`                     |
| `new Uint8Array([1])`, `new Set([1])`, a generator | `undefined`                     |

The function does not throw.
