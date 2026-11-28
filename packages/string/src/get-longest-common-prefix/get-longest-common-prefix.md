# `getLongestCommonPrefix`

Returns the longest shared prefix. An empty list returns `undefined`. No shared prefix returns an empty string.

## Import

```ts
import { getLongestCommonPrefix } from "@sgx4u/string";
```

## Signature

```ts
function getLongestCommonPrefix(values: readonly string[]): string | undefined;
```

## Options

| Argument | Description                                                                                                     |
| -------- | --------------------------------------------------------------------------------------------------------------- |
| `values` | Strings to compare. An empty list, or a non-string element, returns `undefined`. No shared prefix returns `""`. |

## Examples

```ts
getLongestCommonPrefix(["flower", "flow"]);
```

## Edge cases

A non-string element returns `undefined`.
