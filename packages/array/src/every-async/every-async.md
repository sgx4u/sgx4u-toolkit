# `everyAsync`

Returns true when every predicate returns true. An empty array resolves to `true`.

The returned promise rejects when `array` is not an array, when `predicate` is not a function, when `concurrency` is unusable, or when `signal` is already aborted. `stopOnError` defaults to `true`.

## Import

```ts
import { everyAsync } from "@sgx4u/array/async";
```

## Signature

```ts
function everyAsync<Item>(params: EveryAsyncParams<Item>): Promise<boolean>;
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
await everyAsync({
    array: [2, 4],
    predicate: async (item) => item % 2 === 0,
}); // true

await everyAsync({ array: [], predicate: async () => false }); // true
```

## Edge cases

| Input                                           | Result                       |
| ----------------------------------------------- | ---------------------------- |
| Empty array                                     | `true`                       |
| One predicate returns a value other than `true` | `false`                      |
| `array` is not an array                         | Rejects with `TypeError`     |
| `predicate` is not a function                   | Rejects with `TypeError`     |
| `signal` is already aborted                     | Rejects with `signal.reason` |

The input array is not mutated.
