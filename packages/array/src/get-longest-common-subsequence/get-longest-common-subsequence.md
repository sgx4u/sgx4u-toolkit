# `getLongestCommonSubsequence`

Returns one longest common subsequence. Result items come from `first`. When several subsequences have the same length, earlier items of `first` are preferred.

## Import

```ts
import { getLongestCommonSubsequence } from "@sgx4u/array";
```

## Signature

```ts
function getLongestCommonSubsequence<Item>(
    params: GetLongestCommonSubsequenceParams<Item>,
): Item[] | undefined;
```

## Parameters

| Name     | Description                                      |
| -------- | ------------------------------------------------ |
| `first`  | The first sequence. Result items come from here. |
| `second` | The second sequence.                             |
| `equals` | Optional comparer. Defaults to SameValueZero.    |

## Examples

```ts
getLongestCommonSubsequence({ first: [1, 2, 3, 4], second: [2, 4, 6] });
// [2, 4]
```

## Edge cases

| Input                                      | Result             |
| ------------------------------------------ | ------------------ |
| Either side is not an array                | `undefined`        |
| Nothing in common, or either side is empty | `[]`               |
| `equals` is not a function                 | Throws `TypeError` |

The result is a new array. The inputs are not mutated.
