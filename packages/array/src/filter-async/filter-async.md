# `filterAsync`

Keeps the items whose predicate returns true, in input order. The predicate may return a promise.

The returned promise rejects when `array` is not an array, when `predicate` is not a function, when `concurrency` is unusable, or when `signal` is already aborted. `stopOnError` defaults to `true`.

## Import

```ts
import { filterAsync } from "@sgx4u/array/async";
```

## Signature

```ts
function filterAsync<Item>(params: FilterAsyncParams<Item>): Promise<Item[]>;
```

## Parameters

| Name          | Description                                                                                                                       |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `array`       | Items to test.                                                                                                                    |
| `predicate`   | `(item, index, array) => boolean or promise`.                                                                                     |
| `concurrency` | Maximum calls in flight. Defaults to `Infinity`.                                                                                  |
| `signal`      | Aborts before new work starts.                                                                                                    |
| `stopOnError` | When `true` (the default), the first failure rejects the promise. When `false`, failures reject with `AggregateError` at the end. |

## Examples

```ts
await filterAsync({
    array: [1, 2, 3, 4],
    predicate: async (item) => item % 2 === 0,
}); // [2, 4]
```

## Edge cases

| Input                                    | Result                                     |
| ---------------------------------------- | ------------------------------------------ |
| No item matches, or the array is empty   | `[]`                                       |
| `array` is not an array                  | Rejects with `TypeError`                   |
| `predicate` is not a function            | Rejects with `TypeError`                   |
| `concurrency` is unusable                | Rejects with `TypeError` or `RangeError`   |
| `signal` is already aborted              | Rejects with `signal.reason`               |
| A predicate returns a truthy non-boolean | The item is not kept. Only `true` keeps it |

The input is not mutated. The result is a new array.
