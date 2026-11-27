# `createAsyncArray`

Returns the async helpers with `concurrency` bound in. Import it from `@sgx4u/array/async`.

## Signature

```ts
function createAsyncArray(config?: ArrayConfig): AsyncArrayToolkit;
```

`concurrency` defaults to `Infinity`. A per-call `concurrency` replaces it. Other config fields are validated and ignored.

## Example

```ts
import { createAsyncArray } from "@sgx4u/array/async";

const arrays = createAsyncArray({ concurrency: 4 });
await arrays.mapAsync({
    array: [1, 2, 3],
    mapper: async (item) => item,
});
```

## Edge cases

`createAsyncArray({ concurrency: 0 })` throws `RangeError`. The returned object is frozen.
