# `someAsync`

Returns true when any predicate returns true. An empty array resolves to `false`.

The returned promise rejects when `array` is not an array, when `predicate` is not a function, when `concurrency` is unusable, or when `signal` is already aborted. `stopOnError` defaults to `true`.

## Import

```ts
import { someAsync } from "@sgx4u/array/async";
```

## Signature

```ts
function someAsync<Item>(params: SomeAsyncParams<Item>): Promise<boolean>;
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
await someAsync({ array: [1, 2], predicate: async (item) => item > 1 }); // true
await someAsync({ array: [], predicate: async () => true }); // false
```

## Edge cases

| Input                         | Result                       |
| ----------------------------- | ---------------------------- |
| Empty array                   | `false`                      |
| No predicate returns `true`   | `false`                      |
| `array` is not an array       | Rejects with `TypeError`     |
| `predicate` is not a function | Rejects with `TypeError`     |
| `signal` is already aborted   | Rejects with `signal.reason` |

The input array is not mutated.
