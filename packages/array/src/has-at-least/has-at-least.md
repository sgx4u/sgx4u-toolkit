# `hasAtLeast`

Reports whether an array contains at least `count` items. The comparison is `array.length >= count`. The array is not mutated. A non-array, a non-finite `count`, and a non-object argument all return `false`. The function does not throw.

## Import

```ts
import { hasAtLeast, type HasAtLeastParams } from "@sgx4u/array";
```

## Signature

```ts
function hasAtLeast(params: HasAtLeastParams): boolean;
```

## Parameters

| Parameter | Type      | Description                                                                       |
| --------- | --------- | --------------------------------------------------------------------------------- |
| `array`   | `unknown` | The value whose length is compared. A non-array makes the result `false`.         |
| `count`   | `unknown` | The minimum length. A value that is not a finite number makes the result `false`. |

A negative finite `count` is allowed. Every array is at least that long, including an empty array.

## Examples

```ts
hasAtLeast({ array: [1, 2, 3], count: 2 }); // true
hasAtLeast({ array: [], count: 0 }); // true
hasAtLeast({ array: [1], count: 2 }); // false
hasAtLeast({ array: [1, 2], count: Number.NaN }); // false
```

## Edge cases

| Call                                               | Result  |
| -------------------------------------------------- | ------- |
| `{ array: [], count: 0 }`                          | `true`  |
| `{ array: [], count: -1 }`                         | `true`  |
| `{ array: [1, 2], count: 1.5 }`                    | `true`  |
| `{ array: [1], count: 1.5 }`                       | `false` |
| `{ array: [1], count: NaN }` or `Infinity`         | `false` |
| `{ array: [1], count: "2" }` or a missing `count`  | `false` |
| `null`, `{}`, `"text"`                             | `false` |
| `new Uint8Array([1])`, `new Set([1])`, a generator | `false` |

The function does not throw.
