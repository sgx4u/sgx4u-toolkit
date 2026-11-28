# `mapAsyncSettled`

Maps every item and returns a settled outcome for each one, in input order. A mapper failure becomes `{ status: "rejected", reason }`. It does not reject the returned promise.

The promise still rejects when `array` is not an array, when `mapper` is not a function, when `concurrency` is unusable, or when `signal` is aborted.

## Import

```ts
import { mapAsyncSettled } from "@sgx4u/array/async";
```

## Signature

```ts
function mapAsyncSettled<Item, Result>(
    params: MapAsyncSettledParams<Item, Result>,
): Promise<PromiseSettledResult<Result>[]>;
```

A fulfilled outcome is `{ status: "fulfilled", value }`. A rejected outcome is `{ status: "rejected", reason }`.

## Parameters

| Name          | Description                                                         |
| ------------- | ------------------------------------------------------------------- |
| `array`       | Items to map.                                                       |
| `mapper`      | `(item, index, array) => result or promise`. Failures are captured. |
| `concurrency` | Maximum calls in flight. Defaults to `Infinity`.                    |
| `signal`      | Aborts before new work starts. An abort still rejects the promise.  |
| `stopOnError` | Accepted, but mapper failures are captured either way.              |

## Examples

```ts
await mapAsyncSettled({
    array: [1, 2],
    mapper: async (item) => {
        if (item === 2) {
            throw new Error("nope");
        }
        return item;
    },
});
// [
//   { status: "fulfilled", value: 1 },
//   { status: "rejected", reason: Error("nope") },
// ]
```

## Edge cases

| Input                       | Result                                                                       |
| --------------------------- | ---------------------------------------------------------------------------- |
| A mapper throws             | That slot is `{ status: "rejected", reason }` and the promise still resolves |
| `array` is not an array     | Rejects with `TypeError`                                                     |
| `mapper` is not a function  | Rejects with `TypeError`                                                     |
| `concurrency` is unusable   | Rejects with `TypeError` or `RangeError`                                     |
| `signal` is already aborted | Rejects with `signal.reason`                                                 |
| An empty array              | Resolves to `[]`                                                             |

The input array is not mutated. The result is a new array.
