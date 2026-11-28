# `forEachAsync`

Visits every item. The promise resolves to `undefined`.

The returned promise rejects when `array` is not an array, when `visitor` is not a function, when `concurrency` is unusable, or when `signal` is already aborted. `stopOnError` defaults to `true`.

## Import

```ts
import { forEachAsync } from "@sgx4u/array/async";
```

## Signature

```ts
function forEachAsync<Item>(params: ForEachAsyncParams<Item>): Promise<void>;
```

## Parameters

| Name          | Description                                                                          |
| ------------- | ------------------------------------------------------------------------------------ |
| `array`       | Items to visit.                                                                      |
| `visitor`     | `(item, index, array) => ignored result or promise`.                                 |
| `concurrency` | Maximum visits in flight. Defaults to `Infinity`.                                    |
| `signal`      | Aborts before new work starts.                                                       |
| `stopOnError` | Defaults to `true`. `false` rejects with `AggregateError` after every visit settles. |

## Examples

```ts
const seen: number[] = [];
await forEachAsync({
    array: [1, 2, 3],
    visitor: async (item) => {
        seen.push(item);
    },
});
```

## Edge cases

| Input                       | Result                       |
| --------------------------- | ---------------------------- |
| An empty array              | Resolves to `undefined`      |
| `array` is not an array     | Rejects with `TypeError`     |
| `visitor` is not a function | Rejects with `TypeError`     |
| `signal` is already aborted | Rejects with `signal.reason` |

The input array is not mutated.
