# `getLongestCommonSuffix`

Returns the longest shared suffix. An empty list returns `undefined`.

## Import

```ts
import { getLongestCommonSuffix } from "@sgx4u/string";
```

## Signature

```ts
function getLongestCommonSuffix(values: readonly string[]): string | undefined;
```

## Options

| Argument | Description                                                                                                     |
| -------- | --------------------------------------------------------------------------------------------------------------- |
| `values` | Strings to compare. An empty list, or a non-string element, returns `undefined`. No shared suffix returns `""`. |

## Examples

```ts
getLongestCommonSuffix(["testing", "running"]);
```

## Edge cases

No shared suffix returns an empty string.
