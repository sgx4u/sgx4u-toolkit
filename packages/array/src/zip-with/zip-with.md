# `zipWith`

Combines the items at the same index with `combine(...items)`. Length rules match `zip`. The inputs are not mutated.

## Import

```ts
import { zipWith } from "@sgx4u/array";
```

## Signature

```ts
function zipWith<Result>(params: ZipWithParams<Result>): Result[] | undefined;
```

## Parameters

| Name        | Type                                  | Default     | Description                                                  |
| ----------- | ------------------------------------- | ----------- | ------------------------------------------------------------ |
| `arrays`    | `readonly (readonly unknown[])[]`     |             | Arrays to combine. Every slot must be an array.              |
| `combine`   | `(...items) => Result`                |             | Called once per tuple.                                       |
| `mode`      | `"longest" \| "shortest" \| "strict"` | `"longest"` | How many tuples to combine.                                  |
| `fillValue` | `unknown`                             | `undefined` | Passed to `combine` for a missing entry in `"longest"` mode. |

## Examples

```ts
zipWith({
    arrays: [
        [1, 2],
        [3, 4],
    ],
    combine: (left, right) => Number(left) + Number(right),
}); // [4, 6]

zipWith({
    arrays: [[1, 2], [10]],
    fillValue: 0,
    combine: (left, right) => [left, right],
}); // [[1, 10], [2, 0]]
```

## Edge cases

- `null`, a string, or another non-object returns `undefined`.
- An empty list returns `[]` and does not call `combine`.
- A slot that is not an array returns `undefined` when `combine` is a function and `mode` is valid.
- `combine` that is missing or not a function throws `TypeError` before the list is read.
- An unknown `mode` throws `RangeError`.
- `"strict"` with different lengths throws `RangeError` with the same message as `zip`.
- A hole is passed to `combine` as `undefined`.
