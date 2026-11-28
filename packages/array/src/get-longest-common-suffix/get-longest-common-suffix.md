# `getLongestCommonSuffix`

Returns the shared trailing items, in forward order. Result items come from `first`.

## Import

```ts
import { getLongestCommonSuffix } from "@sgx4u/array";
```

## Signature

```ts
function getLongestCommonSuffix<Item>(
    params: GetLongestCommonSuffixParams<Item>,
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
getLongestCommonSuffix({ first: [1, 2, 3], second: [9, 2, 3] }); // [2, 3]
```

## Edge cases

| Input                                          | Result             |
| ---------------------------------------------- | ------------------ |
| Either side is not an array                    | `undefined`        |
| The last items differ, or either side is empty | `[]`               |
| `equals` is not a function                     | Throws `TypeError` |

The result is a new array. The inputs are not mutated.
