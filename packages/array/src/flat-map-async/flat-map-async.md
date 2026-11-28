# `flatMapAsync`

Maps every item and flattens the results one level. A non-array result is one item. An array result contributes its elements and is not flattened further. Order matches the input.

The returned promise rejects when `array` is not an array, when `mapper` is not a function, when `concurrency` is unusable, or when `signal` is already aborted. `stopOnError` defaults to `true`.

## Import

```ts
import { flatMapAsync } from "@sgx4u/array/async";
```

## Signature

```ts
function flatMapAsync<Item, Result>(
    params: FlatMapAsyncParams<Item, Result>,
): Promise<Result[]>;
```

## Parameters

| Name          | Description                                                                         |
| ------------- | ----------------------------------------------------------------------------------- |
| `array`       | Items to map.                                                                       |
| `mapper`      | Returns a result, an array of results, or a promise of either.                      |
| `concurrency` | Maximum calls in flight. Defaults to `Infinity`.                                    |
| `signal`      | Aborts before new work starts.                                                      |
| `stopOnError` | Defaults to `true`. `false` rejects with `AggregateError` after every item settles. |

## Examples

```ts
await flatMapAsync({
    array: [1, 2],
    mapper: async (item) => (item === 1 ? [item, item] : item),
}); // [1, 1, 2]
```

## Edge cases

| Input                        | Result                       |
| ---------------------------- | ---------------------------- |
| A mapper returns a non-array | That value is one item       |
| A mapper returns an array    | Flattened one level          |
| `array` is not an array      | Rejects with `TypeError`     |
| `mapper` is not a function   | Rejects with `TypeError`     |
| `signal` is already aborted  | Rejects with `signal.reason` |

The input is not mutated. The result is a new array.
