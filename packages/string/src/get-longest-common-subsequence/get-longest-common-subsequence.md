# `getLongestCommonSubsequence`

Returns a longest common subsequence. The match does not have to be contiguous.

## Import

```ts
import { getLongestCommonSubsequence } from "@sgx4u/string";
```

## Signature

```ts
function getLongestCommonSubsequence(options: {
    first: string;
    second: string;
}): string | undefined;
```

## Examples

```ts
getLongestCommonSubsequence({ first: "abc", second: "ac" });
```

## Edge cases

A non-string returns `undefined`.
