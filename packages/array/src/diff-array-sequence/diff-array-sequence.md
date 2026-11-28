# `diffArraySequence`

Returns a sequence patch that turns `first` into `second`. The runs are `keep`, `insert`, and `remove`, built from a longest common subsequence. Items in a keep run come from `second`.

## Import

```ts
import { diffArraySequence } from "@sgx4u/array";
```

## Signature

```ts
function diffArraySequence<Item>(
    params: DiffArraySequenceParams<Item>,
): ArrayPatch<Item>[] | undefined;
```

`ArrayPatch` is `{ type: "keep" | "insert" | "remove"; items: Item[] }`.

## Parameters

| Name     | Description                                   |
| -------- | --------------------------------------------- |
| `first`  | The previous sequence.                        |
| `second` | The next sequence.                            |
| `equals` | Optional comparer. Defaults to SameValueZero. |

## Examples

```ts
diffArraySequence({ first: [1, 2, 3], second: [1, 3, 4] });
// keep [1], remove [2], keep [3], insert [4]
```

## Edge cases

| Input                       | Result             |
| --------------------------- | ------------------ |
| Either side is not an array | `undefined`        |
| Both sides are empty        | `[]`               |
| `equals` is not a function  | Throws `TypeError` |

The patch is a new array. The inputs are not mutated. Apply the patch with `applyArrayPatch`, which matches keep and remove runs with SameValueZero.
