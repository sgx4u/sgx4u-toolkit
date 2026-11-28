# `reduceAsync`

Reduces the array from left to right. Each step waits for the previous step. There is no concurrency limit.

`initialValue` is always required. An empty array resolves to that value. The signal is checked before the reduction starts and before each item. An aborted signal rejects with `signal.reason`.

## Import

```ts
import { reduceAsync } from "@sgx4u/array/async";
```

## Signature

```ts
function reduceAsync<Item, Result>(
    params: ReduceAsyncParams<Item, Result>,
): Promise<Result>;
```

## Parameters

| Name           | Description                                                         |
| -------------- | ------------------------------------------------------------------- |
| `array`        | Items to reduce.                                                    |
| `reducer`      | `(accumulator, item, index, array) => next accumulator or promise`. |
| `initialValue` | Required starting accumulator.                                      |
| `signal`       | Checked before the start and before each item.                      |

## Examples

```ts
await reduceAsync({
    array: [1, 2, 3],
    initialValue: 0,
    reducer: async (total, item) => total + item,
}); // 6

await reduceAsync({
    array: [],
    initialValue: 4,
    reducer: async (total) => total,
}); // 4
```

## Edge cases

| Input                                                    | Result                                                                               |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Empty array                                              | Resolves to `initialValue`                                                           |
| `array` is not an array                                  | Rejects with `TypeError`                                                             |
| `reducer` is not a function                              | Rejects with `TypeError`                                                             |
| `initialValue` is missing                                | Rejects with `TypeError`: `` `initialValue` must be provided; received undefined. `` |
| `signal` is already aborted, including on an empty array | Rejects with `signal.reason`                                                         |
| `signal` aborts during an item                           | The next item rejects with `signal.reason`                                           |

The input array is not mutated.
