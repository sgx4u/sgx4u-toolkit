# `createArray`

Returns a frozen object of every root function, with shared defaults bound in. There is no global default. Two instances do not affect each other or the standalone functions.

## Import

```ts
import { createArray } from "@sgx4u/array";
```

## Signature

```ts
function createArray(config?: ArrayConfig): ArrayToolkit;
```

## Config

| Property      | Default            | Used by                                                                    |
| ------------- | ------------------ | -------------------------------------------------------------------------- |
| `equals`      | SameValueZero      | unique, set, search, diff, and toggle functions                            |
| `locale`      | the runtime locale | `sortBy`, `sortNatural`, `createComparator`, and the sorted-search helpers |
| `numeric`     | `false`            | the same sort helpers                                                      |
| `sensitivity` | `"variant"`        | the same sort helpers                                                      |
| `nulls`       | `"last"`           | the same sort helpers                                                      |
| `random`      | `Math.random`      | `shuffleItems`, `sampleItem`, `sampleItems`, `sampleWeighted`              |
| `concurrency` | `Infinity`         | validated here; read by `createAsyncArray`                                 |

A per-call value replaces the bound one. A per-call `seed` wins over a bound `random`.

## Examples

```ts
const arrays = createArray({ locale: "en-IN", numeric: true });

arrays.sortBy({
    array: ["item10", "item2"],
    keys: [(item) => item],
});
// ["item2", "item10"]
```

## Edge cases

| Call                              | Result               |
| --------------------------------- | -------------------- |
| `createArray()`                   | Built-in defaults.   |
| `createArray({ concurrency: 0 })` | Throws `RangeError`. |
| `createArray({ random: 1 })`      | Throws `TypeError`.  |
| `createArray(null)`               | Throws `TypeError`.  |

The returned object is frozen. It is not an array, and it does not include `createArray`.
