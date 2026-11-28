# `getLongestCommonPrefix`

Returns the shared leading items. Result items come from `first`.

## Import

```ts
import { getLongestCommonPrefix } from "@sgx4u/array";
```

## Signature

```ts
function getLongestCommonPrefix<Item>(
    params: GetLongestCommonPrefixParams<Item>,
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
getLongestCommonPrefix({ first: [1, 2, 3], second: [1, 2, 9] }); // [1, 2]
```

## Edge cases

| Input                                           | Result             |
| ----------------------------------------------- | ------------------ |
| Either side is not an array                     | `undefined`        |
| The first items differ, or either side is empty | `[]`               |
| `equals` is not a function                      | Throws `TypeError` |

The result is a new array. The inputs are not mutated.
