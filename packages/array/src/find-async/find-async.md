# `findAsync`

Returns the first item whose predicate is true, in input order. A later predicate may finish first. The result is still the earliest match. Every item is visited.

The returned promise rejects when `array` is not an array, when `predicate` is not a function, when `concurrency` is unusable, or when `signal` is already aborted. `stopOnError` defaults to `true`.

## Import

```ts
import { findAsync } from "@sgx4u/array/async";
```

## Signature

```ts
function findAsync<Item>(
    params: FindAsyncParams<Item>,
): Promise<Item | undefined>;
```

## Parameters

| Name          | Description                                      |
| ------------- | ------------------------------------------------ |
| `array`       | Items to test.                                   |
| `predicate`   | `(item, index, array) => boolean or promise`.    |
| `concurrency` | Maximum calls in flight. Defaults to `Infinity`. |
| `signal`      | Aborts before new work starts.                   |
| `stopOnError` | Defaults to `true`.                              |

## Examples

```ts
await findAsync({
    array: ["a", "bb"],
    predicate: async (item) => item.length > 1,
}); // "bb"
```

## Edge cases

| Input                                      | Result                                   |
| ------------------------------------------ | ---------------------------------------- |
| Nothing matches, or the array is empty     | `undefined`                              |
| A later match finishes first               | The earlier input item is still returned |
| `array` is not an array                    | Rejects with `TypeError`                 |
| `predicate` is not a function              | Rejects with `TypeError`                 |
| `stopOnError: true` and a predicate throws | Rejects with that error                  |
| `signal` is already aborted                | Rejects with `signal.reason`             |

Only a predicate result of `true` is a match. The input is not mutated.
