# `mapAsync`

Maps every item and preserves input order. At most `concurrency` mapper calls are in flight. The default concurrency is `Infinity`.

The returned promise rejects when `array` is not an array, when `mapper` is not a function, when `concurrency` is unusable, or when `signal` is already aborted. It does not resolve `undefined` for those cases. `stopOnError` defaults to `true`.

## Import

```ts
import { mapAsync } from "@sgx4u/array/async";
```

## Signature

```ts
function mapAsync<Item, Result>(
    params: MapAsyncParams<Item, Result>,
): Promise<Result[]>;
```

## Parameters

| Name          | Description                                                                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `array`       | Items to map.                                                                                                                                         |
| `mapper`      | `(item, index, array) => result or promise`.                                                                                                          |
| `concurrency` | Maximum calls in flight. A positive integer or `Infinity`. Defaults to `Infinity`.                                                                    |
| `signal`      | Aborts before new work starts. An already-aborted signal rejects with `signal.reason`.                                                                |
| `stopOnError` | When `true` (the default), the first failure rejects the promise. When `false`, failures are collected and the promise rejects with `AggregateError`. |

## Examples

```ts
await mapAsync({
    array: [1, 2, 3],
    mapper: async (item) => item * 2,
}); // [2, 4, 6]

await mapAsync({
    array: [1, 2, 3, 4, 5, 6],
    concurrency: 2,
    mapper: async (item) => item,
});
```

## Edge cases

| Input                                                 | Result                                                     |
| ----------------------------------------------------- | ---------------------------------------------------------- |
| `array` is not an array                               | Rejects with `TypeError`                                   |
| `mapper` is not a function                            | Rejects with `TypeError`                                   |
| `concurrency` is not a positive integer or `Infinity` | Rejects with `TypeError` or `RangeError`                   |
| `signal` is already aborted                           | Rejects with `signal.reason`                               |
| `stopOnError: true` and a mapper throws               | Rejects with that error                                    |
| `stopOnError: false` and a mapper throws              | Rejects with `AggregateError` after the other items settle |
| `concurrency: 1`                                      | Mapper calls start one at a time, in input order           |
| An empty array                                        | Resolves to `[]`                                           |

The input array is not mutated. The result is a new array.
