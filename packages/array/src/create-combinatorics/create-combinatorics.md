# `createCombinatorics`

Returns the combinatorics helpers. Import it from `@sgx4u/array/combinatorics`.

## Signature

```ts
function createCombinatorics(config?: ArrayConfig): CombinatoricsToolkit;
```

These functions do not read the config. Invalid config still throws at creation, so a shared `ArrayConfig` fails in one place.

## Example

```ts
import { createCombinatorics } from "@sgx4u/array/combinatorics";

const combinatorics = createCombinatorics();
combinatorics.getPairs([1, 2, 3]);
// [[1, 2], [1, 3], [2, 3]]
```

## Edge cases

`createCombinatorics({ concurrency: 0 })` throws `RangeError`. The returned object is frozen.
